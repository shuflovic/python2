import os
import csv
from flask import Flask, send_file, jsonify, request
from dotenv import load_dotenv
from pydantic import BaseModel
from langchain_anthropic import ChatAnthropic
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import PydanticOutputParser
from langchain.agents import create_tool_calling_agent, AgentExecutor
from tools import search_tool, wiki_tool, save_tool
import threading

app = Flask(__name__)

# Load environment variables
load_dotenv()

class ResearchResponse(BaseModel):
    """Structured response model for research output"""
    topic: str
    summary: str
    sources: list[str]
    tools_used: list[str]

def initialize_llm():
    """Initialize the AI model with support for multiple providers"""
    google_key = os.getenv('GOOGLE_API_KEY')
    anthropic_key = os.getenv('ANTHROPIC_API_KEY')

    if google_key:
        try:
            print("🤖 Using Google Gemini (Free)")
            llm = ChatGoogleGenerativeAI(
                model="gemini-1.5-flash",
                api_key=google_key,
                temperature=0.7
            )
            return llm
        except Exception as e:
            print(f"Warning: Error initializing Google Gemini: {e}")
            print("Trying Anthropic Claude...")

    if anthropic_key:
        try:
            print("🤖 Using Anthropic Claude")
            llm = ChatAnthropic(
                model="claude-3-5-sonnet-20241022",
                api_key=anthropic_key
            )
            return llm
        except Exception as e:
            print(f"Error initializing Claude AI: {e}")

    print("\n❌ No valid API keys found!")
    return None

def create_research_agent():
    """Create and configure the research agent with tools and prompts"""
    llm = initialize_llm()
    if not llm:
        return None, None

    parser = PydanticOutputParser(pydantic_object=ResearchResponse)

    prompt = ChatPromptTemplate.from_messages([
        (
            "system",
            """You are an expert research assistant that helps users gather comprehensive information on any topic.

            Your responsibilities:
            1. Use the available tools to search for current and accurate information
            2. Provide well-structured summaries with key insights
            3. Always cite your sources and mention which tools you used
            4. Focus on factual, reliable information from credible sources

            Available tools:
            - search: Use DuckDuckGo to find current web information
            - wikipedia: Query Wikipedia for encyclopedic knowledge
            - save_text_to_file: Save research results to data.csv

            Always structure your final response according to the format instructions below.
            Be thorough but concise, and ensure all information is accurate and well-sourced.

            {format_instructions}""",
        ),
        ("placeholder", "{chat_history}"),
        ("human", "{query}"),
        ("placeholder", "{agent_scratchpad}"),
    ]).partial(format_instructions=parser.get_format_instructions())

    tools = [search_tool, wiki_tool, save_tool]

    agent = create_tool_calling_agent(
        llm=llm,
        prompt=prompt,
        tools=tools
    )

    agent_executor = AgentExecutor(
        agent=agent, 
        tools=tools, 
        verbose=True,
        handle_parsing_errors=True,
        max_iterations=5
    )

    return agent_executor, parser

# Global variables for agent
agent_executor, parser = create_research_agent()

def save_to_csv(response):
    """Save structured research response to data.csv"""
    file_exists = os.path.isfile('data.csv') and os.path.getsize('data.csv') > 0
    with open('data.csv', mode='a', newline='', encoding='utf-8') as file:
        writer = csv.writer(file)
        if not file_exists:
            writer.writerow(['topic', 'summary', 'sources', 'tools_used'])
        writer.writerow([
            response.topic,
            response.summary,
            ';'.join(response.sources),  # Join sources with semicolon
            ';'.join(response.tools_used)  # Join tools with semicolon
        ])

@app.route('/')
def serve_html():
    return send_file('index.html')

@app.route('/data.csv')
def serve_csv():
    if os.path.exists('data.csv'):
        return send_file('data.csv')
    return jsonify({"error": "CSV file not found"}), 404

@app.route('/research', methods=['POST'])
def run_research():
    if not agent_executor:
        return jsonify({"error": "Research agent not initialized"}), 500

    query = request.json.get('query')
    if not query:
        return jsonify({"error": "No query provided"}), 400

    try:
        raw_response = agent_executor.invoke({"query": query})
        if 'output' in raw_response and raw_response['output']:
            structured_response = parser.parse(raw_response['output'])
            save_to_csv(structured_response)
            return jsonify({
                "status": "Research completed",
                "topic": structured_response.topic,
                "summary": structured_response.summary,
                "sources": structured_response.sources,
                "tools_used": structured_response.tools_used
            })
        else:
            return jsonify({"error": "No structured output received"}), 500
    except Exception as e:
        return jsonify({"error": f"Research failed: {str(e)}"}), 500

@app.route('/clear', methods=['POST'])
def clear_all():
    if os.path.exists('data.csv'):
        os.remove('data.csv')
    return jsonify({"status": "All data cleared"})

@app.route('/clear/<topic>', methods=['POST'])
def clear_topic(topic):
    if not os.path.exists('data.csv'):
        return jsonify({"status": "No data to clear"})

    # Read existing data
    rows = []
    with open('data.csv', mode='r', encoding='utf-8') as file:
        reader = csv.reader(file)
        header = next(reader, None)
        for row in reader:
            if row and row[0] != topic:
                rows.append(row)

    # Rewrite CSV without the specified topic
    with open('data.csv', mode='w', newline='', encoding='utf-8') as file:
        writer = csv.writer(file)
        if header:
            writer.writerow(header)
        writer.writerows(rows)

    return jsonify({"status": f"Topic '{topic}' cleared"})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080, debug=True)
