process.env.NODE_ENV = "test";
process.env.BACKEND_URL = "http://localhost:3000";
process.env.DATABASE_URL = "postgresql://u:p@localhost:5432/db";
process.env.MCP_ACCESS_TOKEN = "a".repeat(32);
process.env.MCP_SESSION_SECRET = "b".repeat(32);
process.env.MCP_PUBLIC_HOST = "localhost";
process.env.PORT = "3001";
process.env.MCP_TOOL_PROFILE = "full";