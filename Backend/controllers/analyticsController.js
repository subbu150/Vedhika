import mongoose from "mongoose";
import Event from "../models/Event.js";
import Submission from "../models/Submission.js";
import Comment from "../models/Comment.js";
import Reaction from "../models/Reaction.js";
import Certificate from "../models/Certificate.js";

export const getEventAnalytics = async (req, res) => {
  try {
    const { eventId } = req.params;

    /* ===============================
       CHECK EVENT
    =============================== */
    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    const objectId = new mongoose.Types.ObjectId(eventId);

    /* ======================================================
       SUBMISSION + PARTICIPANT STATS (single aggregation)
    ====================================================== */
    const [submissionStats] = await Submission.aggregate([
      { $match: { event: objectId } },
      {
        $facet: {
          statusCounts: [
            {
              $group: {
                _id: "$status",
                count: { $sum: 1 }
              }
            }
          ],
          uniqueUsers: [
            { $group: { _id: "$user" } },
            { $count: "count" }
          ]
        }
      }
    ]);

    let approved = 0,
      rejected = 0,
      pending = 0;

    submissionStats.statusCounts.forEach(s => {
      if (s._id === "approved") approved = s.count;
      if (s._id === "rejected") rejected = s.count;
      if (s._id === "pending") pending = s.count;
    });

    const total = approved + rejected + pending;
    const uniqueParticipants =
      submissionStats.uniqueUsers[0]?.count || 0;

    /* ======================================================
       PARALLEL FAST COUNTS
    ====================================================== */
    const [
      commentsCount,
      reactionsCount,
      certificatesIssued,
      downloadsAgg
    ] = await Promise.all([
      Comment.countDocuments({ event: eventId }),
      Reaction.countDocuments({ event: eventId }),
      Certificate.countDocuments({ event: eventId, issued: true }),
      Certificate.aggregate([
        { $match: { event: objectId } },
        { $group: { _id: null, total: { $sum: "$downloads" } } }
      ])
    ]);

    const downloads = downloadsAgg[0]?.total || 0;

    /* ======================================================
       RESPONSE STRUCTURE
    ====================================================== */
    const response = {
      event: {
        id: event._id,
        title: event.title,
        mode: event.mode
      },

      submissions: {
        total,
        approved,
        rejected,
        pending,
        approvalRate: total
          ? Math.round((approved / total) * 100)
          : 0
      },

      participants: {
        uniqueParticipants
      },

      engagement: {
        comments: commentsCount,
        reactions: reactionsCount
      },

      certificates: {
        issued: certificatesIssued,
        downloads
      }
    };

    /* ======================================================
       BOOKING METRICS (mode specific)
    ====================================================== */
    if (event.mode === "booking") {
      const seatsBooked = event.booking?.seatsBooked || 0;
      const capacity = event.booking?.capacity || 0;

      response.booking = {
        capacity,
        seatsBooked,
        seatsLeft: capacity - seatsBooked,
        fillPercent: capacity
          ? Math.round((seatsBooked / capacity) * 100)
          : 0
      };
    }

    res.json(response);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const getEventTimeline = async (req, res) => {
  try {
    const { eventId } = req.params;

    const data = await Submission.aggregate([
      {
        $match: {
          event: new mongoose.Types.ObjectId(eventId)
        }
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$createdAt"
            }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    const formatted = data.map(d => ({
      date: d._id,
      count: d.count
    }));

    res.json(formatted);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
