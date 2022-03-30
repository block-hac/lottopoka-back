const axios = require('axios');
const Staging = require('../../models/staging');
const Order = require('../../models/order');
const User = require('../../models/user');
const Result = require('../../models/result');
const History = require('../../models/history');
const { durations, winRates } = require('../../configs/game');
const conf = require('../../configs');
const {
  create27LottoNumbers,
  getLast2digits,
  getLast3digits,
  getLast4digits,
  getFirstPrizeFirst2digits,
  getRedAwardFirst2digits,
  getFirstPrizeLast2digits,
  getRedAwardLast2digits,
  get7thNumbers,
  get3PinNumbers,
  get3PinHeadAndTail,
  get3PinRedAward,
  get4PinRedAward,
} = require('../../lib');

const saveHistory = async (order, totalPoints, matched_count, lottoNumbers) => {
  let ordered_userInfo = await User.findOne({ userId: order.userId });
  console.log(lottoNumbers);
  let newHistory = new History({
    userId: order.userId,
    gameType: 'hanoi',
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

const processBackpack = async (order, lottoNumbers) => {
  let totalPoints = 0;
  let matched_count = 0;
  let order_numbers = order.numbers.split(';');
  order_numbers.pop();
  console.log('[PROCESS:BACKPACK]');
  switch (order.digitType) {
    case 'lot2': {
      let last2digits = getLast2digits(lottoNumbers);
      matched_count = order_numbers.filter((e) =>
        last2digits.includes(e)
      ).length;
      if (matched_count == 0) {
        totalPoints = 0;
      } else {
        totalPoints =
          (2 * matched_count - 1) *
          winRates.lot27.backpack.lot2 *
          order.multiple;
        totalPoints = (totalPoints / 22840).toFixed(2);
      }
      await saveHistory(order, totalPoints, matched_count, lottoNumbers);
      return;
    }
    case 'lot2_1K': {
      let first2digits = getLast2digits(lottoNumbers);
      matched_count = order_numbers.filter((e) =>
        first2digits.includes(e)
      ).length;
      if (matched_count == 0) {
        totalPoints = 0;
      } else {
        totalPoints =
          (2 * matched_count - 1) *
          winRates.lot27.backpack.lot2_1K *
          order.multiple;
        totalPoints = (totalPoints / 22840).toFixed(2);
      }
      await saveHistory(order, totalPoints, matched_count, lottoNumbers);
      return;
    }
    case 'lot3': {
      let last3digits = getLast3digits(lottoNumbers);
      matched_count = order_numbers.filter((e) =>
        last3digits.includes(e)
      ).length;
      if (matched_count == 0) {
        totalPoints = 0;
      } else {
        totalPoints =
          (2 * matched_count - 1) *
          winRates.lot27.backpack.lot3 *
          order.multiple;
        totalPoints = (totalPoints / 22840).toFixed(2);
      }
      await saveHistory(order, totalPoints, matched_count, lottoNumbers);
      return;
    }
    case 'lot4': {
      let last4digits = getLast4digits(lottoNumbers);
      matched_count = order_numbers.filter((e) =>
        last4digits.includes(e)
      ).length;
      if (matched_count == 0) {
        totalPoints = 0;
      } else {
        totalPoints =
          (2 * matched_count - 1) *
          winRates.lot27.backpack.lot4 *
          order.multiple;
        totalPoints = (totalPoints / 22840).toFixed(2);
      }
      await saveHistory(order, totalPoints, matched_count, lottoNumbers);
      return;
    }
    default:
      return;
  }
};

const processLoxien = async (order, lottoNumbers) => {
  let totalPoints = 0;
  let matched_count = 0;
  let order_numbers = order.numbers.split(';');
  order_numbers.pop();
  let last2digits = getLast2digits(lottoNumbers);
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
          winRates.lot27.loxien.loxien2 *
          order.multiple;
        totalPoints = (totalPoints / 22840).toFixed(2);
      }
      await saveHistory(order, totalPoints, matched_count, lottoNumbers);
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
          winRates.lot27.loxien.loxien3 *
          order.multiple;
        totalPoints = (totalPoints / 22840).toFixed(2);
      }
      await saveHistory(order, totalPoints, matched_count, lottoNumbers);
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
          winRates.lot27.loxien.loxien3 *
          order.multiple;
        totalPoints = (totalPoints / 22840).toFixed(2);
      }
      await saveHistory(order, totalPoints, matched_count, lottoNumbers);
      return;
    default:
      return;
  }
};

const processScore = async (order, lottoNumbers) => {
  let totalPoints = 0;
  let matched_count = 0;
  let order_numbers = order.numbers.split(';');
  order_numbers.pop();
  switch (order.digitType) {
    case 'first': {
      let firstPrizeLast2digit = getFirstPrizeLast2digits(lottoNumbers);
      matched_count = order_numbers.filter(
        (e) => e == firstPrizeLast2digit
      ).length;
      if (matched_count == 0) {
        totalPoints = 0;
      } else {
        totalPoints =
          (2 * matched_count - 1) * winRates.lot27.score.first * order.multiple;
        totalPoints = (totalPoints / 22840).toFixed(2);
      }
      await saveHistory(order, totalPoints, matched_count, lottoNumbers);
      return;
    }
    case 'special_topics': {
      let redAwardLast2digit = getRedAwardLast2digits(lottoNumbers);
      matched_count = order_numbers.filter(
        (e) => e == redAwardLast2digit
      ).length;
      if (matched_count == 0) {
        totalPoints = 0;
      } else {
        totalPoints =
          (2 * matched_count - 1) *
          winRates.lot27.score.special_topics *
          order.multiple;
        totalPoints = (totalPoints / 22840).toFixed(2);
      }
      await saveHistory(order, totalPoints, matched_count, lottoNumbers);
      return;
    }
    case 'special_headline': {
      let redAwardFirst2digit = getRedAwardFirst2digits(lottoNumbers);
      matched_count = order_numbers.filter(
        (e) => e == redAwardFirst2digit
      ).length;
      if (matched_count == 0) {
        totalPoints = 0;
      } else {
        totalPoints =
          (2 * matched_count - 1) *
          winRates.lot27.score.special_headline *
          order.multiple;
        totalPoints = (totalPoints / 22840).toFixed(2);
      }
      await saveHistory(order, totalPoints, matched_count, lottoNumbers);
      return;
    }
    case 'problem': {
      let seventhNumbers = get7thNumbers(lottoNumbers);
      matched_count = order_numbers.filter((e) =>
        seventhNumbers.includes(e)
      ).length;
      if (matched_count == 0) {
        totalPoints = 0;
      } else {
        totalPoints =
          (2 * matched_count - 1) *
          winRates.lot27.score.problem *
          order.multiple;
        totalPoints = (totalPoints / 22840).toFixed(2);
      }
      await saveHistory(order, totalPoints, matched_count, lottoNumbers);
      return;
    }
    case 'first_de': {
      let firstPrizeFirst2digit = getFirstPrizeFirst2digits(lottoNumbers);
      matched_count = order_numbers.filter(
        (e) => e == firstPrizeFirst2digit
      ).length;
      if (matched_count == 0) {
        totalPoints = 0;
      } else {
        totalPoints =
          (2 * matched_count - 1) *
          winRates.lot27.score.first_de *
          order.multiple;
        totalPoints = (totalPoints / 22840).toFixed(2);
      }
      await saveHistory(order, totalPoints, matched_count, lottoNumbers);
      return;
    }
    default:
      return;
  }
};

const processHeadAndTail = async (order, lottoNumbers) => {
  let totalPoints = 0;
  let matched_count = 0;
  let order_numbers = order.numbers.split(';');
  order_numbers.pop();
  switch (order.digitType) {
    case 'head': {
      let tenthDigit = lottoNumbers.redAward.substr(3, 4);
      matched_count = order_numbers.filter((e) => e == tenthDigit).length;
      if (matched_count == 0) {
        totalPoints = 0;
      } else {
        totalPoints =
          (2 * matched_count - 1) *
          winRates.lot27.headandtail.head *
          order.multiple;
        totalPoints = (totalPoints / 22840).toFixed(2);
      }
      await saveHistory(order, totalPoints, matched_count, lottoNumbers);
      return;
    }
    case 'tail': {
      let unitDigit = lottoNumbers.redAward.substr(4, 5);
      matched_count = order_numbers.filter((e) => e == unitDigit).length;
      if (matched_count == 0) {
        totalPoints = 0;
      } else {
        totalPoints =
          (2 * matched_count - 1) *
          winRates.lot27.headandtail.tail *
          order.multiple;
        totalPoints = (totalPoints / 22840).toFixed(2);
      }
      await saveHistory(order, totalPoints, matched_count, lottoNumbers);
      return;
    }
    default:
      return;
  }
};

const processThreeMore = async (order, lottoNumbers) => {
  let totalPoints = 0;
  let matched_count = 0;
  let order_numbers = order.numbers.split(';');
  order_numbers.pop();
  switch (order.digitType) {
    case 'pin3': {
      let pin3Numbers = get3PinNumbers(lottoNumbers);
      matched_count = order_numbers.filter((e) =>
        pin3Numbers.includes(e)
      ).length;
      if (matched_count == 0) {
        totalPoints = 0;
      } else {
        totalPoints =
          (2 * matched_count - 1) *
          winRates.lot27.threeMore.pin3 *
          order.multiple;
        totalPoints = (totalPoints / 22840).toFixed(2);
      }
      await saveHistory(order, totalPoints, matched_count, lottoNumbers);
      return;
    }
    case 'pin3_headandtail': {
      let pin3HeadAndTail = get3PinHeadAndTail(lottoNumbers);
      matched_count = order_numbers.filter((e) =>
        pin3HeadAndTail.includes(e)
      ).length;
      if (matched_count == 0) {
        totalPoints = 0;
      } else {
        totalPoints =
          (2 * matched_count - 1) *
          winRates.lot27.threeMore.pin3_headandtail *
          order.multiple;
        totalPoints = (totalPoints / 22840).toFixed(2);
      }
      await saveHistory(order, totalPoints, matched_count, lottoNumbers);
      return;
    }
    case 'special_pin3': {
      let pin3Special = get3PinRedAward(lottoNumbers);
      matched_count = order_numbers.filter((e) => e == pin3Special).length;
      if (matched_count == 0) {
        totalPoints = 0;
      } else {
        totalPoints =
          (2 * matched_count - 1) *
          winRates.lot27.threeMore.special_pin3 *
          order.multiple;
        totalPoints = (totalPoints / 22840).toFixed(2);
      }
      await saveHistory(order, totalPoints, matched_count, lottoNumbers);
      return;
    }
    default:
      return;
  }
};

const processFourMore = async (order, lottoNumbers) => {
  let totalPoints = 0;
  let order_numbers = order.numbers.split(';');
  order_numbers.pop();
  let pin4Special = get4PinRedAward(lottoNumbers);
  let matched_count = order_numbers.filter((e) => e == pin4Special).length;
  if (matched_count == 0) {
    totalPoints = 0;
  } else {
    totalPoints =
      (2 * matched_count - 1) * winRates.lot27.fourMore * order.multiple;
    totalPoints = (totalPoints / 22840).toFixed(2);
  }
  await saveHistory(order, totalPoints, matched_count, lottoNumbers);
  return;
};

const processSlide = async (order, lottoNumbers) => {
  let totalPoints = 0;
  let matched_count = 0;
  let order_numbers = order.numbers.split(';');
  order_numbers.pop();
  let last2digits = getLast2digits(lottoNumbers);
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
          winRates.lot27.slide.slide4 *
          order.multiple;
        totalPoints = (totalPoints / 22840).toFixed(2);
      }
      await saveHistory(order, totalPoints, matched_count, lottoNumbers);
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
          winRates.lot27.slide.slide8 *
          order.multiple;
        totalPoints = (totalPoints / 22840).toFixed(2);
      }
      await saveHistory(order, totalPoints, matched_count, lottoNumbers);
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
          winRates.lot27.slide.slide10 *
          order.multiple;
        totalPoints = (totalPoints / 22840).toFixed(2);
      }
      await saveHistory(order, totalPoints, matched_count, lottoNumbers);
      return;
    default:
      return;
  }
};

const processJackpot = async (order, lottoNumbers) => {
  let totalPoints = 0;
  let matched_count = 0;
  let order_numbers = order.numbers.split(';');
  order_numbers.pop();
  console.log('[PROCESS:JACK]');
  let redAwardLast2digit = getRedAwardLast2digits(lottoNumbers);
  matched_count = order_numbers.filter((e) => e == redAwardLast2digit).length;
  if (matched_count == 0) {
    totalPoints = 0;
  } else {
    totalPoints =
      (2 * matched_count - 1) *
      winRates.lot27.score.special_topics *
      order.multiple;
    totalPoints = (totalPoints / 22840).toFixed(2);
  }
  await saveHistory(order, totalPoints, matched_count, lottoNumbers);
  return;
};

const processOrders = async (io, prevEndTime) => {
  let lottoNumbers = create27LottoNumbers();
  let newResult = new Result({
    endTime: prevEndTime,
    gameType: 'hanoi',
    numbers: lottoNumbers,
  });

  await newResult.save();
  await Staging.updateOne({ gameType: 'hanoi' }, { numbers: lottoNumbers });
  let orders = await Order.find({ gameType: 'hanoi', processed: false });
  if (orders.length === 0) {
    let endTime = Date.now() + durations.perDay;
    await Staging.updateOne({ gameType: 'hanoi' }, { endTime: endTime });
    io.in('hanoi').emit('START_NEW_GAME', 'hanoi');
    startLoopProcess(io, endTime);
  } else {
    for (let order of orders) {
      switch (order.betType) {
        case 'backpack': {
          await processBackpack(order, lottoNumbers);
          break;
        }
        case 'loxien': {
          await processLoxien(order, lottoNumbers);
          break;
        }
        case 'score': {
          await processScore(order, lottoNumbers);
          break;
        }
        case 'headandtail': {
          await processHeadAndTail(order, lottoNumbers);
          break;
        }
        case 'threeMore': {
          await processThreeMore(order, lottoNumbers);
          break;
        }
        case 'fourMore': {
          await processFourMore(order, lottoNumbers);
          break;
        }
        case 'slide': {
          await processSlide(order, lottoNumbers);
          break;
        }
        case 'jackpot': {
          await processJackpot(order, lottoNumbers);
          break;
        }
        default:
          break;
      }
    }
    // await Order.deleteMany({});
    let endTime = Date.now() + durations.perDay;
    await Staging.updateOne({ gameType: 'hanoi' }, { endTime: endTime });
    io.in('hanoi').emit('START_NEW_GAME', 'hanoi');
    startLoopProcess(io, endTime);
  }
};

const startLoopProcess = async (io, endTime) => {
  let duration = endTime - Date.now();
  let interval = setInterval(() => {
    duration -= 1000;
    io.in('hanoi').emit('TIMER', { duration: duration, game: 'hanoi' });
    if (duration < 0) {
      clearInterval(interval);
      processOrders(io, endTime);
    }
  }, 1000);
};

exports.startHanoiVIPLotteryService = async (io) => {
  console.log('[HANOI_SERVICE]: Start hanoi VIP lottery service ...');
  let gameInfo = await Staging.findOne({ gameType: 'hanoi' });
  if (gameInfo) {
    if (gameInfo.endTime > Date.now()) {
      const endT = new Date(gameInfo.endTime).getTime();
      startLoopProcess(io, endT);
    } else {
      console.log(
        '[HANOI_SERVICE]: Last game is already ended ... creating new game ...'
      );
      let newEndTime = Date.now() + durations.perDay;
      await Staging.updateOne({ gameType: 'hanoi' }, { endTime: newEndTime });
      startLoopProcess(io, newEndTime);
    }
  } else {
    console.log('[HANOI_SERVICE]: Creating staging game info ...');
    let endTime = Date.now() + durations.perDay;
    let newStaging = new Staging({
      gameType: 'hanoi',
      endTime: endTime,
    });
    await newStaging.save();
    startLoopProcess(io, endTime);
  }
};
