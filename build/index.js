import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { getAllPapers, getPaperByFilter, upload } from "./helper.js";
const PEC_PAPERS_API_BASE = "https://pecpapers.onrender.com";
const USER_AGENT = "pecp-mcp/1.0";
// Create server instance
const server = new McpServer({
    name: "pecp-mcp",
    version: "1.0.0",
    capabilities: {
        resources: {},
        tools: {},
    },
});
// TOOL 1 : GET ALL THE PAPERS AVAILBLE IN THE DATABASE
server.tool("get-all-papers-in-databse", "Get all the papers available in the database", {}, async (_args, _extra) => {
    const response = await getAllPapers();
    return {
        content: [
            {
                type: "text",
                text: JSON.stringify(response)
            }
        ]
    };
});
// TOOL 2 : GET ALL THE PAPERS BASED ON FILTERS LIKE SEMESTER, DEPARTMENT, SUBJECT NAME, AND EXAM TYPE
server.tool("get-all-papers-based-on-filters", "Get all the papers based on filters like semester, department, subject name, and exam type", {
    semester: z.string().optional(),
    department: z.string().optional(),
    subjectName: z.string().optional(),
    examType: z.string().optional(),
}, async (args) => {
    // Extract and pass individual arguments to getPaperByFilter
    const { semester = "", department = "", subjectName = "", examType = "" } = args;
    const response = await getPaperByFilter(semester, department, subjectName, examType);
    return {
        content: [
            {
                type: "text",
                text: JSON.stringify(response)
            }
        ]
    };
});
// TOOL 3 : UPLOAD PAPER TO THE DATABASE
server.tool("upload-paper-to-database", "Upload all the details of the paper to the database i.e cloudUrl, semester, department, subject name, and exam type. These details are required to upload the paper", {
    semester: z.string(),
    department: z.string(),
    subjectName: z.string(),
    examType: z.string(),
    cloudUrl: z.array(z.string()),
    comments: z.string(),
}, async (args) => {
    // Extract and pass individual arguments to getPaperByFilter
    const { semester = "", department = "", subjectName = "", examType = "", cloudUrl = [], comments = "" } = args;
    const response = await upload(cloudUrl, semester, department, subjectName, examType, comments);
    return {
        content: [
            {
                type: "text",
                text: JSON.stringify(response)
            }
        ]
    };
});
async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("PEC Papers MCP running on stdio");
}
main().catch((error) => {
    console.error("Fatal error in main():", error);
    process.exit(1);
});
