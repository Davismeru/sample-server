const express = require("express");
const router = express.Router();
const usersModel = require("../models/users");

router.patch("/check_in", async (req, res) => {
  const { phone_no } = req.body;

  const getUser = await usersModel.findOne({ phone_no: phone_no });
  const checkedInTime = getUser.checkedInTime;
  const currentTime = new Date().getTime();

  const updatedUserTime = await usersModel.findOneAndUpdate(
    {
      phone_no: phone_no,
    },
    [
      {
        $set: {
          checkedIn: {
            $cond: {
              if: { $lte: [checkedInTime + 86400000 - currentTime, 0] },
              then: false,
              else: true,
            },
          },

          checkedDays: {
            $cond: {
              if: { $lte: [checkedInTime + 86400000 - currentTime, 0] },
              then: { $add: ["$checkedDays", 1] },
              else: "$checkedDays",
            },
          },

          checkedInTime: {
            $cond: {
              if: { $lte: [checkedInTime + 86400000 - currentTime, 0] },
              then: new Date().getTime(),
              else: "$checkedInTime",
            },
          },

          balance: {
            $cond: {
              if: { $lte: [checkedInTime + 86400000 - currentTime, 0] },
              then: { $add: ["$balance", 25] },
              else: "$balance",
            },
          },
        },
      },
    ]
  );

  // 24 hours after checkedIn time
  const futureDate = updatedUserTime?.checkedInTime + 86400000; // 24 hours in milliseconds
  const timeDifference = futureDate - currentTime;

  res.json({
    timeDiff: timeDifference,
    daysChecked: updatedUserTime.checkedDays,
    checkedStatus: updatedUserTime.checkedIn,
  });
});

module.exports = router;
