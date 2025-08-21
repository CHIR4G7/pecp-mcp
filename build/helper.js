import axios from "axios";
const PEC_PAPERS_API_BASE = "https://pecpapers.onrender.com";
const USER_AGENT = "pecp-mcp/1.0";
export async function getAllPapers() {
    const response = await fetch(`${PEC_PAPERS_API_BASE}/getallpapers`, {
        headers: {
            "User-Agent": USER_AGENT,
        },
    });
    if (!response.ok) {
        throw new Error(`Failed to fetch papers: ${response.statusText}`);
    }
    return response.json();
}
export async function getPaperByFilter(semester, department, subjectName, examType) {
    const response = await fetch(`${PEC_PAPERS_API_BASE}/papersOnFilterOrSearch?semester=${semester}&subjectName=${subjectName}&department=${department}&examType=${examType}`, {
        headers: {
            "User-Agent": USER_AGENT,
        },
    });
    if (!response.ok) {
        throw new Error(`Failed to fetch papers: ${response.statusText}`);
    }
    return response.json();
}
export async function getHealth() {
    const response = await fetch(`${PEC_PAPERS_API_BASE}/healthz'`, {
        headers: {
            "User-Agent": USER_AGENT,
        },
    });
    if (!response.ok) {
        throw new Error(`Failed to fetch health status: ${response.statusText}`);
    }
    return response.json();
}
export async function upload(cloudUrl, semester, department, subjectName, examType, comments) {
    const formData = new FormData();
    formData.append("semester", semester);
    formData.append("department", department);
    formData.append("subjectName", subjectName);
    formData.append("examType", examType);
    const paperData = {
        department: department,
        examType: examType,
        semester: semester,
        subjectName: subjectName,
        cloudUrl: cloudUrl,
        comments: comments
    };
    const payLoad = {
        data: paperData
    };
    const response = await axios.post(`${PEC_PAPERS_API_BASE}/upload-paper`, payLoad, {
        headers: {
            "User-Agent": USER_AGENT,
        }
    });
    if (!response.data.ok) {
        throw new Error(`Failed to upload paper: ${response.statusText}`);
    }
    return response.data;
}
