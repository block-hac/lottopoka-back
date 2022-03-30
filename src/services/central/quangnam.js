const Staging = require('../../models/staging');
const Order = require('../../models/order');
const User = require('../../models/user');
const Result = require('../../models/result');
const History = require('../../models/history');
const { durations, winRates } = require('../../configs/game');
const conf = require('../../configs');
const axios = require('axios');
const {
  getLast2digits_18,
  getLast3digits_18,
  getLast4digits_18,
  getFirstPrizeFirst2digits_18,
  getRedAwardFirst2digits_18,
  getFirstPrizeLast2digits_18,
  getRedAwardLast2digits_18,
  get3PinHeadAndTail_18,
  get3PinRedAward_18,
  get4PinRedAward_18,
  getScoreHeadAndTail_18,
  getCentralQuangNamLottoNumbers,
} = require('../../lib');

const saveHistory = async (
  order,
  totalPoints,
  matched_count,
  lottoNumbers,
  io
) => {
  let ordered_userInfo = await User.findOne({ userId: order.userId });
  let newHistory = new History({
    userId: order.userId,
    gameType: 'central-quangnam',
    betType: order.betType,
    digitType: order.digitType,
    resultNumbers: lottoNumbers,
    numbers: order.numbers,
    multiple: order.multiple,
    betAmount: order.betAmount,
    winningAmount: totalPoints,
    processed: true,
    status: matched_count > 0 ? 'win' : 'lose',
  });
  await newHistory.save();
  io.in('central-quangnam').emit('NEW_RESULT', 'central-quangnam');
  await axios.post(
    `${conf.serviceUrl}/create-transaction`,
    {
      game: 'lottopoka',
      transactionId: order._id + 'f',
      type: 'win',
      amount: totalPoints,
    },
    {
      headers: {
        Authorization: ordered_userInfo.token,
        'Content-Type': 'application/json',
      },
    }
  );
  await Order.updateOne(
    { _id: order._id },
    { processed: true, status: matched_count > 0 ? 'win' : 'lose' }
  );
};

const processBackpack = async (order, lottoNumbers, io) => {
  let totalPoints = 0;
  let matched_count = 0;
  let order_numbers = order.numbers.split(';');
  order_numbers.pop();
  console.log('[PROCESS:BACKPACK]');
  switch (order.digitType) {
    case 'lot2': {
      let last2digits = getLast2digits_18(lottoNumbers);
      matched_count = order_numbers.filter((e) =>
        last2digits.includes(e)
      ).length;
      if (matched_count == 0) {
        totalPoints = 0;
      } else {
        totalPoints =
          (2 * matched_count - 1) *
          winRates.lot18.backpack.lot2 *
          order.multiple;
        totalPoints = (totalPoints / 22840).toFixed(2);
      }
      await saveHistory(order, totalPoints, matched_count, lottoNumbers, io);
      return;
    }
    case 'lot2_1K': {
      let first2digits = getLast2digits_18(lottoNumbers);
      matched_count = order_numbers.filter((e) =>
        first2digits.includes(e)
      ).length;
      if (matched_count == 0) {
        totalPoints = 0;
      } else {
        totalPoints =
          (2 * matched_count - 1) *
          winRates.lot18.backpack.lot2_1K *
          order.multiple;
        totalPoints = (totalPoints / 22840).toFixed(2);
      }
      await saveHistory(order, totalPoints, matched_count, lottoNumbers, io);
      return;
    }
    case 'lot3': {
      let last3digits = getLast3digits_18(lottoNumbers);
      matched_count = order_numbers.filter((e) =>
        last3digits.includes(e)
      ).length;
      if (matched_count == 0) {
        totalPoints = 0;
      } else {
        totalPoints =
          (2 * matched_count - 1) *
          winRates.lot18.backpack.lot3 *
          order.multiple;
        totalPoints = (totalPoints / 22840).toFixed(2);
      }
      await saveHistory(order, totalPoints, matched_count, lottoNumbers, io);
      return;
    }
    case 'lot4': {
      let last4digits = getLast4digits_18(lottoNumbers);
      matched_count = order_numbers.filter((e) =>
        last4digits.includes(e)
      ).length;
      if (matched_count == 0) {
        totalPoints = 0;
      } else {
        totalPoints =
          (2 * matched_count - 1) *
          winRates.lot18.backpack.lot4 *
          order.multiple;
        totalPoints = (totalPoints / 22840).toFixed(2);
      }
      await saveHistory(order, totalPoints, matched_count, lottoNumbers, io);
      return;
    }
    default:
      return;
  }
};

const processLoxien = async (order, lottoNumbers, io) => {
  let totalPoints = 0;
  let matched_count = 0;
  let order_numbers = order.numbers.split(';');
  order_numbers.pop();
  let last2digits = getLast2digits_18(lottoNumbers);
  console.log('[PROCESS:LOXIEN]]');
  switch (order.digitType) {
    case 'xien2':
      for (let pair of order_numbers) {
        let elements = pair.split('&');
        if (elements.every((e) => last2digits.includes(e))) {
          matched_count++;
        }
      }
      if (matched_count == 0) {
        totalPoints = 0;
      } else {
        totalPoints =
          (2 * matched_count - 1) *
          winRates.lot18.loxien.loxien2 *
          order.multiple;
        totalPoints = (totalPoints / 22840).toFixed(2);
      }
      await saveHistory(order, totalPoints, matched_count, lottoNumbers, io);
      return;
    case 'xien3':
      for (let pair of order_numbers) {
        let elements = pair.split('&');
        if (elements.every((e) => last2digits.includes(e))) {
          matched_count++;
        }
      }
      if (matched_count == 0) {
        totalPoints = 0;
      } else {
        totalPoints =
          (2 * matched_count - 1) *
          winRates.lot18.loxien.loxien3 *
          order.multiple;
        totalPoints = (totalPoints / 22840).toFixed(2);
      }
      await saveHistory(order, totalPoints, matched_count, lottoNumbers, io);
      return;
    case 'xien4':
      for (let pair of order_numbers) {
        let elements = pair.split('&');
        if (elements.every((e) => last2digits.includes(e))) {
          matched_count++;
        }
      }
      if (matched_count == 0) {
        totalPoints = 0;
      } else {
        totalPoints =
          (2 * matched_count - 1) *
          winRates.lot18.loxien.loxien3 *
          order.multiple;
        totalPoints = (totalPoints / 22840).toFixed(2);
      }
      await saveHistory(order, totalPoints, matched_count, lottoNumbers, io);
      return;
    default:
      return;
  }
};

const processScore = async (order, lottoNumbers, io) => {
  let totalPoints = 0;
  let matched_count = 0;
  let order_numbers = order.numbers.split(';');
  order_numbers.pop();
  switch (order.digitType) {
    case 'first': {
      let firstPrizeLast2digit = getFirstPrizeLast2digits_18(lottoNumbers);
      matched_count = order_numbers.filter(
        (e) => e == firstPrizeLast2digit
      ).length;
      if (matched_count == 0) {
        totalPoints = 0;
      } else {
        totalPoints =
          (2 * matched_count - 1) * winRates.lot18.score.first * order.multiple;
        totalPoints = (totalPoints / 22840).toFixed(2);
      }
      await saveHistory(order, totalPoints, matched_count, lottoNumbers, io);
      return;
    }
    case 'special_topics': {
      let redAwardLast2digit = getRedAwardLast2digits_18(lottoNumbers);
      matched_count = order_numbers.filter(
        (e) => e == redAwardLast2digit
      ).length;
      if (matched_count == 0) {
        totalPoints = 0;
      } else {
        totalPoints =
          (2 * matched_count - 1) *
          winRates.lot18.score.special_topics *
          order.multiple;
        totalPoints = (totalPoints / 22840).toFixed(2);
      }
      await saveHistory(order, totalPoints, matched_count, lottoNumbers, io);
      return;
    }
    case 'special_headline': {
      let redAwardFirst2digit = getRedAwardFirst2digits_18(lottoNumbers);
      matched_count = order_numbers.filter(
        (e) => e == redAwardFirst2digit
      ).length;
      if (matched_count == 0) {
        totalPoints = 0;
      } else {
        totalPoints =
          (2 * matched_count - 1) *
          winRates.lot18.score.special_headline *
          order.multiple;
        totalPoints = (totalPoints / 22840).toFixed(2);
      }
      await saveHistory(order, totalPoints, matched_count, lottoNumbers, io);
      return;
    }
    case 'special_heading': {
      matched_count = order_numbers.filter(
        (e) => e == lottoNumbers.eighth
      ).length;
      if (matched_count == 0) {
        totalPoints = 0;
      } else {
        totalPoints =
          (2 * matched_count - 1) *
          winRates.lot18.score.special_heading *
          order.multiple;
        totalPoints = (totalPoints / 22840).toFixed(2);
      }
      await saveHistory(order, totalPoints, matched_count, lottoNumbers, io);
      return;
    }
    case 'special_headandtail': {
      let headandtail = getScoreHeadAndTail_18(lottoNumbers);
      matched_count = order_numbers.filter((e) =>
        headandtail.includes(e)
      ).length;
      if (matched_count == 0) {
        totalPoints = 0;
      } else {
        totalPoints =
          (2 * matched_count - 1) *
          winRates.lot18.score.special_headandtail *
          order.multiple;
        totalPoints = (totalPoints / 22840).toFixed(2);
      }
      await saveHistory(order, totalPoints, matched_count, lottoNumbers, io);
      return;
    }
    case 'first_de': {
      let firstPrizeFirst2digit = getFirstPrizeFirst2digits_18(lottoNumbers);
      matched_count = order_numbers.filter(
        (e) => e == firstPrizeFirst2digit
      ).length;
      if (matched_count == 0) {
        totalPoints = 0;
      } else {
        totalPoints =
          (2 * matched_count - 1) *
          winRates.lot18.score.first_de *
          order.multiple;
        totalPoints = (totalPoints / 22840).toFixed(2);
      }
      await saveHistory(order, totalPoints, matched_count, lottoNumbers, io);
      return;
    }
    default:
      return;
  }
};

const processHeadAndTail = async (order, lottoNumbers, io) => {
  let totalPoints = 0;
  let matched_count = 0;
  let order_numbers = order.numbers.split(';');
  order_numbers.pop();
  switch (order.digitType) {
    case 'head': {
      let tenthDigit = lottoNumbers.redAward.substr(4, 1);
      matched_count = order_numbers.filter((e) => e == tenthDigit).length;
      if (matched_count == 0) {
        totalPoints = 0;
      } else {
        totalPoints =
          (2 * matched_count - 1) *
          winRates.lot18.headandtail.head *
          order.multiple;
        totalPoints = (totalPoints / 22840).toFixed(2);
      }
      await saveHistory(order, totalPoints, matched_count, lottoNumbers, io);
      return;
    }
    case 'tail': {
      let unitDigit = lottoNumbers.redAward.substr(5, 1);
      matched_count = order_numbers.filter((e) => e == unitDigit).length;
      if (matched_count == 0) {
        totalPoints = 0;
      } else {
        totalPoints =
          (2 * matched_count - 1) *
          winRates.lot18.headandtail.tail *
          order.multiple;
        totalPoints = (totalPoints / 22840).toFixed(2);
      }
      await saveHistory(order, totalPoints, matched_count, lottoNumbers, io);
      return;
    }
    default:
      return;
  }
};

const processThreeMore = async (order, lottoNumbers, io) => {
  let totalPoints = 0;
  let matched_count = 0;
  let order_numbers = order.numbers.split(';');
  order_numbers.pop();
  switch (order.digitType) {
    case 'pin3':
      matched_count = order_numbers.filter(
        (e) => e == lottoNumbers.seventh
      ).length;
      if (matched_count == 0) {
        totalPoints = 0;
      } else {
        totalPoints =
          (2 * matched_count - 1) *
          winRates.lot18.threeMore.pin3 *
          order.multiple;
        totalPoints = (totalPoints / 22840).toFixed(2);
      }
      await saveHistory(order, totalPoints, matched_count, lottoNumbers, io);
      return;
    case 'pin3_headandtail': {
      let pin3HeadAndTail = get3PinHeadAndTail_18(lottoNumbers);
      matched_count = order_numbers.filter((e) =>
        pin3HeadAndTail.includes(e)
      ).length;
      if (matched_count == 0) {
        totalPoints = 0;
      } else {
        totalPoints =
          (2 * matched_count - 1) *
          winRates.lot18.threeMore.pin3_headandtail *
          order.multiple;
        totalPoints = (totalPoints / 22840).toFixed(2);
      }
      await saveHistory(order, totalPoints, matched_count, lottoNumbers, io);
      return;
    }
    case 'special_pin3': {
      let pin3Special = get3PinRedAward_18(lottoNumbers);
      matched_count = order_numbers.filter((e) => e == pin3Special).length;
      if (matched_count == 0) {
        totalPoints = 0;
      } else {
        totalPoints =
          (2 * matched_count - 1) *
          winRates.lot18.threeMore.special_pin3 *
          order.multiple;
        totalPoints = (totalPoints / 22840).toFixed(2);
      }
      await saveHistory(order, totalPoints, matched_count, lottoNumbers, io);
      return;
    }
    default:
      return;
  }
};

const processFourMore = async (order, lottoNumbers, io) => {
  let totalPoints = 0;
  let order_numbers = order.numbers.split(';');
  order_numbers.pop();
  let pin4Special = get4PinRedAward_18(lottoNumbers);
  let matched_count = order_numbers.filter((e) => e == pin4Special).length;
  if (matched_count == 0) {
    totalPoints = 0;
  } else {
    totalPoints =
      (2 * matched_count - 1) * winRates.lot18.fourMore * order.multiple;
    totalPoints = (totalPoints / 22840).toFixed(2);
  }
  await saveHistory(order, totalPoints, matched_count, lottoNumbers, io);
  return;
};

const processSlide = async (order, lottoNumbers, io) => {
  let totalPoints = 0;
  let matched_count = 0;
  let order_numbers = order.numbers.split(';');
  order_numbers.pop();
  let last2digits = getLast2digits_18(lottoNumbers);
  switch (order.digitType) {
    case 'slide4':
      for (let pair of order_numbers) {
        let elements = pair.split('&');
        if (elements.every((e) => !last2digits.includes(e))) {
          matched_count++;
        }
      }
      if (matched_count == 0) {
        totalPoints = 0;
      } else {
        totalPoints =
          (2 * matched_count - 1) *
          winRates.lot18.slide.slide4 *
          order.multiple;
        totalPoints = (totalPoints / 22840).toFixed(2);
      }
      await saveHistory(order, totalPoints, matched_count, lottoNumbers, io);
      return;
    case 'slide8':
      for (let pair of order_numbers) {
        let elements = pair.split('&');
        if (elements.every((e) => !last2digits.includes(e))) {
          matched_count++;
        }
      }
      if (matched_count == 0) {
        totalPoints = 0;
      } else {
        totalPoints =
          (2 * matched_count - 1) *
          winRates.lot18.slide.slide8 *
          order.multiple;
        totalPoints = (totalPoints / 22840).toFixed(2);
      }
      await saveHistory(order, totalPoints, matched_count, lottoNumbers, io);
      return;
    case 'slide10':
      for (let pair of order_numbers) {
        let elements = pair.split('&');
        if (elements.every((e) => !last2digits.includes(e))) {
          matched_count++;
        }
      }
      if (matched_count == 0) {
        totalPoints = 0;
      } else {
        totalPoints =
          (2 * matched_count - 1) *
          winRates.lot18.slide.slide10 *
          order.multiple;
        totalPoints = (totalPoints / 22840).toFixed(2);
      }
      await saveHistory(order, totalPoints, matched_count, lottoNumbers, io);
      return;
    default:
      return;
  }
};

const startNewGameAndProcessOrders = async (
  io,
  prevRestrictTime,
  prevEndTime
) => {
  console.log('[START]:[NEW]:[GAME]');

  let endTime = prevEndTime + durations.perWeek;
  let restrictTime = prevRestrictTime + durations.perWeek;

  await Staging.updateOne(
    { gameType: 'central-quangnam' },
    { endTime: endTime, restrictTime: restrictTime }
  );

  io.in('central-quangnam').emit('START_NEW_GAME', 'central-quangnam');

  setTimeout(async () => {
    let lottoNumbers = await getCentralQuangNamLottoNumbers();
    let newResult = new Result({
      endTime: prevEndTime,
      restrictTime: prevRestrictTime,
      gameType: 'central-quangnam',
      numbers: lottoNumbers,
    });
    await newResult.save();
    await Staging.updateOne(
      { gameType: 'central-quangnam' },
      { numbers: lottoNumbers }
    );

    if (lottoNumbers === {}) {
      await Order.updateMany(
        { gameType: 'central-quangnam' },
        { status: 'missing' }
      );
    } else {
      let orders = await Order.find({
        gameType: 'central-quangnam',
        processed: false,
        status: 'pending',
      });

      if (orders.length === 0) {
        let endTime = prevEndTime + durations.perWeek;
        let restrictTime = prevRestrictTime + durations.perWeek;

        await Staging.updateOne(
          { gameType: 'central-quangnam' },
          { endTime: endTime, restrictTime: restrictTime }
        );

        io.in('central-quangnam').emit('START_NEW_GAME', 'central-quangnam');

        startLoopProcess(io, restrictTime, endTime);
      } else {
        for (let order of orders) {
          switch (order.betType) {
            case 'backpack': {
              console.log('[BACKPACK]');
              await processBackpack(order, lottoNumbers, io);
              break;
            }
            case 'loxien': {
              await processLoxien(order, lottoNumbers, io);
              break;
            }
            case 'score': {
              await processScore(order, lottoNumbers, io);
              break;
            }
            case 'headandtail': {
              await processHeadAndTail(order, lottoNumbers, io);
              break;
            }
            case 'threeMore': {
              await processThreeMore(order, lottoNumbers, io);
              break;
            }
            case 'fourMore': {
              await processFourMore(order, lottoNumbers, io);
              break;
            }
            case 'slide': {
              await processSlide(order, lottoNumbers, io);
              break;
            }
            default:
              break;
          }
        }
        await Order.deleteMany({});
      }
    }
  }, durations.processDuration);
  startLoopProcess(io, restrictTime, endTime);
};

const startLoopProcess = async (io, restrictTime, endTime) => {
  let duration = endTime - Date.now();
  let interval = setInterval(() => {
    duration -= 1000;
    io.in('central-quangnam').emit('TIMER', {
      duration: duration,
      game: 'central-quangnam',
    });
    if (restrictTime - Date.now() < 0) {
      io.in('central-quangnam').emit('RESTRICT_BET_CENTRAL_QUANGNAM', 'STOP');
    }
    if (duration < 0) {
      clearInterval(interval);
      startNewGameAndProcessOrders(io, restrictTime, endTime);
    }
  }, 1000);
};

exports.startCentralQuangNamLotteryService = async (io) => {
  console.log('[START]:[CENTRAL_QUANGNAM_DAEMON]');
  let gameInfo = await Staging.findOne({ gameType: 'central-quangnam' });
  if (gameInfo) {
    if (gameInfo.endTime > Date.now()) {
      if (gameInfo.restrictTime > Date.now()) {
        io.in('central-quangnam').emit('RESTRICT_BET_CENTRAL_QUANGNAM', 'STOP');
      } else {
        io.in('central-quangnam').emit('ENABLE_BET_CENTRAL_QUANGNAM', 'START');
      }
      const restrictT = new Date(gameInfo.restrictTime).getTime();
      const endT = new Date(gameInfo.endTime).getTime();
      startLoopProcess(io, restrictT, endT);
    } else {
      let weeks =
        Math.floor(
          (Date.now() - Number(conf.seedTimeCentralQuangnam)) /
            durations.perWeek
        ) + 1;
      let newEndTime =
        Number(conf.seedTimeCentralQuangnam) + durations.perWeek * weeks;
      let newRestrictTime = newEndTime - durations.restrictDuration;
      await Staging.updateOne(
        { gameType: 'central-quangnam' },
        { endTime: newEndTime, restrictTime: newRestrictTime }
      );
      startLoopProcess(io, newRestrictTime, newEndTime);
    }
  } else {
    let weeks =
      Math.floor(
        (Date.now() - Number(conf.seedTimeCentralQuangnam)) / durations.perWeek
      ) + 1;
    let newEndTime =
      Number(conf.seedTimeCentralQuangnam) + durations.perWeek * weeks;
    let newRestrictTime = newEndTime - durations.restrictDuration;
    let newStaging = new Staging({
      gameType: 'central-quangnam',
      restrictTime: newRestrictTime,
      endTime: newEndTime,
    });

    await newStaging.save();
    startLoopProcess(io, newRestrictTime, newEndTime);
  }
};
