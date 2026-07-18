const { GoogleGenAI } = require("@google/genai");
const { z } = require("zod");
const { zodToJsonSchema } = require("zod-to-json-schema");
const puppeteer = require("puppeteer");

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GENAI_API_KEY,
});

const interviewReportSchema = z.object({
  matchScore: z
    .number()
    .describe(
      "A score between 0 and 1 indicating how well the candidate matches the job description",
    ),
  technicalQuestions: z
    .array(
      z.object({
        question: z
          .string()
          .describe("The technical question can be asked in the interview"),
        intention: z.string().describe("The intention behind the question"),
        answer: z
          .string()
          .describe("How to answer the question, what point to make"),
      }),
    )
    .describe(
      "The technical questions that can be asked in the interview along with the intention and answer",
    ),
  behavioralQuestions: z
    .array(
      z.object({
        question: z
          .string()
          .describe("The behavioral question can be asked in the interview"),
        intention: z.string().describe("The intention behind the question"),
        answer: z
          .string()
          .describe("How to answer the question, what point to make"),
      }),
    )
    .describe(
      "The behavioral questions that can be asked in the interview along with the intention and answer",
    ),
  skillGaps: z
    .array(
      z.object({
        skill: z.string().describe("The skill that the candidate is lacking"),
        severity: z
          .enum(["low", "medium", "high"])
          .describe("The severity of the skill gap"),
      }),
    )
    .describe(
      "The list of skill gaps identified in the candidate along with the severity",
    ),
  preparationPlan: z
    .array(
      z.object({
        day: z
          .number()
          .describe(
            "The day number of the preparation plan starting from 1 to 7",
          ),
        focus: z
          .string()
          .describe(
            "The focus area for that day e.g, data structures, system design, etc",
          ),
        tasks: z
          .array(z.string())
          .describe(
            "The list of tasks to be completed on that day to follow the preparation plan",
          ),
      }),
    )
    .describe(
      "A day-wise preparation plan for the candidate to follow in order to prepare for the interview",
    ),
  title: z
    .string()
    .describe(
      "The title of the job for which the interview report is generated",
    ),
});

async function generateInterviewReport({
  resume,
  selfDescription,
  jobDescription,
}) {
  const prompt = `
You are a Senior Technical Recruiter, Engineering Manager, and Career Coach with over 15 years of experience hiring software engineers.

Your job is to analyze the candidate's profile and generate a realistic interview preparation report.

You MUST return ONLY valid JSON.

Do NOT include:

- Markdown
- Triple backticks
- Explanations
- Notes
- Comments
- Additional text

The response MUST be a single JSON object.

=====================================================
CANDIDATE INFORMATION
=====================================================

Resume:

${resume}

-----------------------------------------------------

Self Description:

${selfDescription}

-----------------------------------------------------

Job Description:

${jobDescription}

=====================================================
ANALYSIS INSTRUCTIONS
=====================================================

Analyze the resume against the job description.

Consider:

• Technical skills
• Project experience
• Internship/work experience
• Communication ability
• Leadership
• Technologies
• Missing technologies
• Confidence shown in self description
• Education
• Overall employability

=====================================================
OUTPUT FORMAT
=====================================================

Return EXACTLY this JSON structure.

{
  "matchScore": 0,

  "technicalQuestions": [
    {
      "question": "",
      "intention": "",
      "answer": ""
    }
  ],

  "behaviouralQuestions": [
    {
      "question": "",
      "intention": "",
      "answer": ""
    }
  ],

  "skillGaps": [
    {
      "skill": "",
      "severity": "low"
    }
  ],

  "preparationPlan": [
    {
      "day": 1,
      "focus": "",
      "tasks": [
        "",
        ""
      ]
    }
  ]
}

=====================================================
RULES
=====================================================

MATCH SCORE

Return a number between 0 and 100.

Scoring Guidelines:

90-100
Excellent match

80-89
Strong candidate

70-79
Good candidate with noticeable gaps

60-69
Average candidate

Below 60
Needs significant preparation

=====================================================

TECHNICAL QUESTIONS

Generate EXACTLY 5 questions.

Each question MUST contain

question

intention

answer

The answer field should explain

• what the interviewer expects

• key concepts

• common mistakes

• ideal approach

Questions should become progressively harder.

Avoid generic textbook questions.

=====================================================

BEHAVIOURAL QUESTIONS

Generate EXACTLY 5 questions.

Each object must contain

question

intention

answer

The answer should recommend using the STAR framework whenever appropriate.

=====================================================

SKILL GAPS

Return between 3 and 6 skill gaps.

Each object must contain

skill

severity

Severity MUST be exactly one of

low

medium

high

Do NOT invent skill gaps.

Only include gaps that genuinely exist based on the resume and job description.

=====================================================

PREPARATION PLAN

Generate a 7-day preparation plan.

Return EXACTLY 7 objects.

Each object must contain

day

focus

tasks

Rules:

day starts at 1

day ends at 7

focus should be one topic only

tasks must contain 3 to 5 actionable tasks.

Example tasks

- Solve 10 LeetCode Medium problems

- Build a JWT authentication project

- Revise React Hooks

- Practice MongoDB Aggregation

- Take one mock interview

=====================================================

QUALITY REQUIREMENTS

Everything should be

Specific

Realistic

Actionable

Professional

Interview focused

=====================================================

VERY IMPORTANT

technicalQuestions MUST be an array of OBJECTS.

NOT strings.

Correct:

{
  "question": "...",
  "intention": "...",
  "answer": "..."
}

Wrong:

"Explain React Hooks"

=====================================================

behaviouralQuestions MUST be an array of OBJECTS.

NOT strings.

=====================================================

skillGaps MUST be an array of OBJECTS.

Correct:

{
  "skill":"Docker",
  "severity":"high"
}

Wrong:

"Docker"

=====================================================

preparationPlan MUST be an array of OBJECTS.

Correct:

{
  "day":1,
  "focus":"React",
  "tasks":[
      "...",
      "..."
  ]
}

Wrong:

"Day 1: Learn React"

=====================================================

Return ONLY the JSON object.
`;
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      temperature: 0.2,
      responseMimeType: "application/json",
      jsonSchema: zodToJsonSchema(interviewReportSchema),
    },
  });

  return JSON.parse(response.text);
}

async function generatePdfFromHtml(htmlContent) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setContent(htmlContent, { waitUntil: "networkidle0" });

  const pdfBuffer = await page.pdf({
    format: "A4",
    margin: {
      top: "20mm",
      bottom: "20mm",
      left: "15mm",
      right: "15mm",
    },
  });

  await browser.close();

  return pdfBuffer;
}

async function generateResumePdf({ resume, selfDescription, jobDescription }) {
  const resumePdfSchema = z.object({
    html: z
      .string()
      .describe(
        "The HTML content of the resume which can be converted to PDF using any library like puppeteer",
      ),
  });

  const prompt = `Generate resume for a candidate with the following details:
                        Resume: ${resume}
                        Self Description: ${selfDescription}
                        Job Description: ${jobDescription}

                        the response should be a JSON object with a single field "html" which contains the HTML content of the resume which can be converted to PDF using any library like puppeteer.
                        The resume should be tailored for the given job description and should highlight the candidate's strengths and relevant experience. The HTML content should be well-formatted and structured, making it easy to read and visually appealing.
                        The content of resume should be not sound like it's generated by AI and should be as close as possible to a real human-written resume.
                        you can highlight the content using some colors or different font styles but the overall design should be simple and professional.
                        The content should be ATS friendly, i.e. it should be easily parsable by ATS systems without losing important information.
                        The resume should not be so lengthy, it should ideally be 1-2 pages long when converted to PDF. Focus on quality rather than quantity and make sure to include all the relevant information that can increase the candidate's chances of getting an interview call for the given job description.
                    `;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: zodToJsonSchema(resumePdfSchema),
    },
  });

  const jsonContent = JSON.parse(response.text);

  const pdfBuffer = await generatePdfFromHtml(jsonContent.html);

  return pdfBuffer;
}

module.exports = { generateInterviewReport, generateResumePdf };
