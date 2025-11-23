// server/jobs/dailyNotificationJob.js
import cron from "node-cron";
import nodemailer from "nodemailer";
import User from "../models/User.js";
import Application from "../models/Application.js";

/* ----------------- LAZY EMAIL SETUP (GMAIL + NODEMAILER) ----------------- */

let transporter = null;

const getTransporter = () => {
  if (transporter) return transporter;

  const gmailUser = process.env.GMAIL_USER;
  const gmailPass = process.env.GMAIL_PASS;

  if (!gmailUser || !gmailPass) {
    console.warn(
      "[JobTrackr] GMAIL_USER or GMAIL_PASS not set – email sending is disabled."
    );
    return null;
  }

  transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: gmailUser,
      pass: gmailPass,
    },
  });

  console.log("[JobTrackr] Email transporter configured with Gmail.");
  return transporter;
};

const sendEmail = async ({ to, subject, text }) => {
  const t = getTransporter();
  if (!t) {
    console.log(
      "[JobTrackr] Email disabled. Would have sent:",
      { to, subject }
    );
    return;
  }

  const from = process.env.EMAIL_FROM || process.env.GMAIL_USER;

  const mailOptions = {
    from,
    to,
    subject,
    text,
  };

  await t.sendMail(mailOptions);
};

/* --------------- NOTIFICATION BUILDING (same logic as UI) ----------------- */

const buildNotificationsFromApplications = (applications) => {
  const todayStr = new Date().toISOString().slice(0, 10);

  const addDays = (dateStr, days) => {
    const d = new Date(dateStr);
    d.setDate(d.getDate() + days);
    return d.toISOString().slice(0, 10);
  };

  const threeDaysLater = addDays(todayStr, 3);

  const today = [];
  const overdue = [];
  const upcoming = [];

  applications.forEach((app) => {
    if (!app.nextFollowUpDate) return;

    const dateStr = new Date(app.nextFollowUpDate)
      .toISOString()
      .slice(0, 10);

    const base = {
      applicationId: app._id,
      company: app.company,
      position: app.position,
      status: app.status,
      nextFollowUpDate: dateStr,
    };

    if (dateStr < todayStr) {
      overdue.push({
        ...base,
        type: "followup-overdue",
        message: `Follow up with ${app.company} for ${app.position}`,
      });
    } else if (dateStr === todayStr) {
      today.push({
        ...base,
        type: "followup-today",
        message: `Follow up today with ${app.company} (${app.position})`,
      });
    } else if (dateStr > todayStr && dateStr <= threeDaysLater) {
      upcoming.push({
        ...base,
        type: "followup-upcoming",
        message: `Upcoming follow-up with ${app.company} on ${dateStr}`,
      });
    }
  });

  return { today, overdue, upcoming };
};

/* ---------------- EMAIL BODY FOR EACH USER (DAILY) ------------------ */

const buildEmailBody = (user, today, overdue, upcoming) => {
  const name = user.name || "there";
  const lines = [`Hi ${name},`, "", "Here are your JobTrackr reminders:"];

  if (overdue.length) {
    lines.push("", "⚠ Overdue follow-ups:");
    overdue.forEach((n, idx) => {
      lines.push(
        `${idx + 1}. ${n.company} – ${n.position} (status: ${n.status}, follow-up was on ${n.nextFollowUpDate})`
      );
    });
  }

  if (today.length) {
    lines.push("", "📅 Due today:");
    today.forEach((n, idx) => {
      lines.push(
        `${idx + 1}. ${n.company} – ${n.position} (status: ${n.status})`
      );
    });
  }

  if (upcoming.length) {
    lines.push("", "⏳ Upcoming (next 3 days):");
    upcoming.forEach((n, idx) => {
      lines.push(
        `${idx + 1}. ${n.company} – ${n.position} on ${n.nextFollowUpDate} (status: ${n.status})`
      );
    });
  }

  lines.push("", "All the best for your job search!", "– JobTrackr");
  return lines.join("\n");
};

/* -------------------- MAIN DAILY CHECK FUNCTION --------------------- */

export const runDailyNotificationCheck = async () => {
  try {
    console.log("[JobTrackr] Running daily email notification check...");

    const users = await User.find({});

    for (const user of users) {
      if (!user.email) continue;

      const apps = await Application.find({ user: user._id });
      const { today, overdue, upcoming } =
        buildNotificationsFromApplications(apps);

      if (!today.length && !overdue.length && !upcoming.length) continue;

      const subjectParts = [];
      if (overdue.length) subjectParts.push("overdue follow-ups");
      if (today.length) subjectParts.push("today's follow-ups");
      if (upcoming.length) subjectParts.push("upcoming tasks");

      const subject = `JobTrackr: ${subjectParts.join(", ")}`;
      const text = buildEmailBody(user, today, overdue, upcoming);

      await sendEmail({
        to: user.email,
        subject,
        text,
      });
    }

    console.log("[JobTrackr] Daily email notification check finished.");
  } catch (err) {
    console.error("[JobTrackr] Daily notification check failed:", err);
  }
};

/* --------------------- CRON SCHEDULER STARTER ----------------------- */

export const startDailyNotificationJob = () => {
  const hour = Number(process.env.REMINDER_HOUR || "8"); // default 8 AM

  // normal daily schedule
  const cronExpr = `0 ${hour} * * *`;

  // for testing, you can temporarily use:
  // const cronExpr = "*/2 * * * *"; // every 2 minutes

  cron.schedule(cronExpr, () => {
    runDailyNotificationCheck();
  });

  console.log(
    `[JobTrackr] Daily notification job scheduled at hour ${hour} with cron "${cronExpr}"`
  );
};
