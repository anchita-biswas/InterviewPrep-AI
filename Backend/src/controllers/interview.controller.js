const pdfParse = require("pdf-parse");
const interviewReportModel = require("../models/interviewReport.model");
const { generateInterviewReport, generateResumePdf } = require("../services/ai.service.js");

/**
 * @desc Generate interview report based on job description, resume pdf and self description
 * @route POST /api/interview
 * @access Private
 */
async function generateInterviewReportController(req, res) {
  if (!req.file) {
    return res.status(400).json({
      message: "Resume file (PDF) is required as form-data field 'resume'",
    });
  }

  const resumeContent = await new pdfParse.PDFParse(
    Uint8Array.from(req.file.buffer),
  ).getText();
  const { selfDescription, jobDescription } = req.body;

  const interviewReportByAi = await generateInterviewReport({
    resume: resumeContent.text,
    selfDescription,
    jobDescription,
  });

  const interviewReport = await interviewReportModel.create({
    user: req.user.id,
    resume: resumeContent.text,
    selfDescription,
    jobDescription,
    ...interviewReportByAi,
  });

  res.status(201).json({
    message: "Interview report generated successfully",
    interviewReport,
  });
}

/**
 * @desc Get interview report by interviewId
 * @route GET /api/interview/report/:interviewId
 * @access Private
 */
async function getInterviewReportByIdController(req, res) {
  const { interviewId } = req.params;
  const interviewReport = await interviewReportModel.findOne({
    _id: interviewId,
    user: req.user.id,
  });
  if (!interviewReport) {
    return res.status(404).json({
      message: "Interview report not found",
    });
  }
  res.status(200).json({
    message: "Interview report retrieved successfully",
    interviewReport,
  });
}

/**
 * @desc Get all interview reports for the authenticated user
 * @route GET /api/interview
 * @access Private
 */
async function getAllInterviewReportsController(req, res) {
  const interviewReports = await interviewReportModel
    .find({ user: req.user.id })
    .sort({ createdAt: -1 })
    .select(
      "-resume -selfDescription -jobDescription -__v -technicalQuestions -behaviouralQuestions -skillGaps -preparationPlan",
    );
  res.status(200).json({
    message: "Interview reports retrieved successfully",
    interviewReports,
  });
}


/**
 * @desc Generate resume PDF based on user input
 * @route POST /api/interview/resume
 * @access Private
 */
async function generateResumePdfController(req, res) {
  const { interviewReportId } = req.params;

  const interviewReport = await interviewReportModel.findById(interviewReportId);

  if (!interviewReport) {
    return res.status(404).json({
      message: "Interview report not found",
    });
  }

  const { resume, jobDescription, selfDescription } = interviewReport;
  
  const pdfBuffer = await generateResumePdf({ resume, jobDescription, selfDescription });

  res.set({
    "Content-Type": "application/pdf",
    "Content-Disposition": `attachment; filename=resume_${interviewReportId}.pdf`,
  }); 

  res.send(pdfBuffer);

}

module.exports = {
  generateInterviewReportController,
  getInterviewReportByIdController,
  getAllInterviewReportsController,
  generateResumePdfController,
};
