const fs = require("node:fs");
const path = require("node:path");

const messagesFile = path.join(__dirname, "messages.txt");

function cleanMessage(line) {
  return line.replace(/^\s*\d+\)\s*/, "").trim();
}

function classify(text) {
  const lowered = text.toLowerCase();

  const complaintWords = [
    "очередь",
    "холодная",
    "пропал",
    "не работает",
    "сломал",
    "нет wi-fi",
    "нет wifi",
  ];
  const helpWords = ["как получить", "справк", "где", "парковк"];

  if (complaintWords.some((word) => lowered.includes(word))) {
    return "жалоба";
  }
  if (helpWords.some((word) => lowered.includes(word))) {
    return "справка";
  }
  return "другое";
}

function draftAnswer(text, category) {
  const lowered = text.toLowerCase();

  if (lowered.includes("справк")) {
    return "Здравствуйте! Справку о месте учёбы можно запросить в деканате или учебном офисе. Уточните, пожалуйста, ФИО, группу и нужный формат справки.";
  }
  if (lowered.includes("столов")) {
    return "Здравствуйте! Спасибо за обращение. Передадим информацию ответственным за работу столовой и проверим ситуацию с очередью и температурой блюд.";
  }
  if (lowered.includes("консультац")) {
    return "Здравствуйте! Напишите, пожалуйста, удобное время завтра и тему консультации. Мы проверим расписание и подтвердим запись.";
  }
  if (lowered.includes("wi-fi") || lowered.includes("wifi")) {
    return "Здравствуйте! Передадим заявку технической службе. Уточните, пожалуйста, этаж и аудиторию в корпусе B, где пропал Wi-Fi.";
  }
  if (lowered.includes("парковк")) {
    return "Здравствуйте! Гостевая парковка находится у главного входа. Если нужен въезд на территорию, заранее сообщите дату, время и номер автомобиля.";
  }

  if (category === "жалоба") {
    return "Здравствуйте! Спасибо за сигнал. Мы передадим обращение ответственным и вернёмся с ответом.";
  }
  if (category === "справка") {
    return "Здравствуйте! Уточните, пожалуйста, детали вопроса, и мы подскажем порядок действий.";
  }
  return "Здравствуйте! Спасибо за обращение. Мы уточним информацию и направим ответ.";
}

function readMessages(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`Файл ${filePath} не найден`);
  }

  return fs
    .readFileSync(filePath, "utf8")
    .split(/\r?\n/)
    .map(cleanMessage)
    .filter(Boolean);
}

function main() {
  const messages = readMessages(messagesFile);

  messages.forEach((message, index) => {
    const category = classify(message);
    const answer = draftAnswer(message, category);

    console.log(`${index + 1}. ${message}`);
    console.log(`Категория: ${category}`);
    console.log(`Черновик ответа: ${answer}`);
    console.log("");
  });
}

main();
