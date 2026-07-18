const mongoose = require("mongoose");

/**
 * - job description schema
 * - resume text
 * - Self description
 *
 * - matchScore : Number
 *
 * - Technical questions : [{
 *      question : "",
 *      intention : "",
 *      answer : "",
 * }]
 * - Behavioural questions : [{
 *      question : "",
 *      intention : "",
 *      answer : "", *
 * }]
 * - Skill gaps : [{
 *      skill: "",
 *      severity : "",
 *      type : String,
 *      enum : ["low", "medium", "high"],
 *
 * }]
 * - Preparation plan : [{
 *      day : number,
 *      topic : String,
 *      task : [String]
 * }]
 */

const technicalQuestionSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: [true, "Technical question is requied."],
    },
    intention: {
      type: String,
      required: [true, "Intention is required."],
    },
    answer: {
      type: String,
      required: [true, "Answer is required."],
    },
  },
  {
    _id: false,
  },
);

const behaviouralQuestionSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: [true, "Behavioural question is requied."],
    },
    intention: {
      type: String,
      required: [true, "Intention is required."],
    },
    answer: {
      type: String,
      required: [true, "Answer is required."],
    },
  },
  {
    _id: false,
  },
);

const skillGapSchema = new mongoose.Schema(
  {
    skill: {
      type: String,
      required: [true, "Skill is required"],
    },
    severity: {
      type: String,
      enum: ["low", "medium", "high"],
      required: [true, "Severity is required"],
    },
  },
  {
    _id: false,
  },
);

const preparationPlanSchema = new mongoose.Schema({
  day: {
    type: Number,
    required: [true, "Day is required"],
  },
  focus: {
    type: String,
    required: [true, "Focus is required"],
  },
  tasks: [
    {
      type: String,
      required: [true, "Task is required"],
    },
  ],
});

const interviewReportSchema = new mongoose.Schema(
  {
    jobDescription: {
      type: String,
      required: [true, "Job description is required"],
    },
    resume: {
      type: String,
    },
    selfDescription: {
      type: String,
    },
    matchScore: {
      type: Number,
      min: 0,
      max: 100,
    },
    technicalQuestions: [technicalQuestionSchema],
    behaviouralQuestions: [behaviouralQuestionSchema],
    skillGaps: [skillGapSchema],
    preparationPlan: [preparationPlanSchema],
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: [true, "User is required"],
    },
    title: {
      type: String,
      required: [true, "Title is required"],
    },
  },
  {
    timestamps: true,
  },
);

const interviewReportModel = mongoose.model(
  "InterviewReport",
  interviewReportSchema,
);

module.exports = interviewReportModel;
