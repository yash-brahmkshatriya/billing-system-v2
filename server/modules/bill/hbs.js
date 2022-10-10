const path = require('path');
const fs = require('fs');
const handlebars = require('handlebars');
const dayjs = require('dayjs');

const PARTIALS_PATH = path.join(__dirname, 'template', 'partials');

const partials = fs.readdirSync(PARTIALS_PATH).map((partialFile) => {
  let partialName = partialFile
    .split('.')[0]
    .split('-')
    .map((str, index) => {
      if (index === 0) return str;
      else return str[0].toUpperCase() + str.slice(1);
    })
    .join('');
  return {
    name: partialName,
    file: fs.readFileSync(path.join(PARTIALS_PATH, partialFile)).toString(),
  };
});

// Partials
partials.forEach((partial) =>
  handlebars.registerPartial(partial.name, handlebars.compile(partial.file))
);

// Helpers
handlebars.registerHelper('ifRelop', function (v1, relop, v2, options) {
  let isTrue = false;
  switch (relop) {
    case '==':
      isTrue = v1 == v2;
      break;
    case '<':
      isTrue = v1 < v2;
      break;
    case '>':
      isTrue = v1 > v2;
      break;
    case '>=':
      isTrue = v1 >= v2;
      break;
    case '<=':
      isTrue = v1 <= v2;
      break;
    case '!=':
      isTrue = v1 != v2;
      break;
    case '&&':
      isTrue = v1 && v2;
      break;
    case '||':
      isTrue = v1 || v2;
      break;
    default:
      break;
  }
  return isTrue ? options.fn(this) : options.inverse(this);
});

handlebars.registerHelper('add', function (...args) {
  let answer = 0;
  for (let i = 0; i < args.length - 1; i++) answer += args[i];
  return answer;
});

handlebars.registerHelper('toLowerCase', function (str) {
  return str.toLowerCase();
});

handlebars.registerHelper('toFixed', function (number, uptoDecimalPts) {
  if (typeof number === 'number') {
    return number.toFixed(uptoDecimalPts);
  } else return number;
});

handlebars.registerHelper('toWords', function (num) {
  if (typeof num !== 'number') return num;
  let a = [
    '',
    'One ',
    'Two ',
    'Three ',
    'Four ',
    'Five ',
    'Six ',
    'Seven ',
    'Eight ',
    'Nine ',
    'Ten ',
    'Eleven ',
    'Twelve ',
    'Thirteen ',
    'Fourteen ',
    'Fifteen ',
    'Sixteen ',
    'Seventeen ',
    'Eighteen ',
    'Nineteen ',
  ];
  let b = [
    '',
    '',
    'Twenty',
    'Thirty',
    'Forty',
    'Fifty',
    'Sixty',
    'Seventy',
    'Eighty',
    'Ninety',
  ];

  if ((num = num.toString()).length > 9) return 'OverFlow';
  n = ('000000000' + num)
    .substr(-9)
    .match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
  if (!n) return;
  var str = '';
  str +=
    n[1] != 0
      ? (a[Number(n[1])] || b[n[1][0]] + ' ' + a[n[1][1]]) + 'crore '
      : '';
  str +=
    n[2] != 0
      ? (a[Number(n[2])] || b[n[2][0]] + ' ' + a[n[2][1]]) + 'lakh '
      : '';
  str +=
    n[3] != 0
      ? (a[Number(n[3])] || b[n[3][0]] + ' ' + a[n[3][1]]) + 'thousand '
      : '';
  str +=
    n[4] != 0
      ? (a[Number(n[4])] || b[n[4][0]] + ' ' + a[n[4][1]]) + 'hundred '
      : '';
  str +=
    n[5] != 0
      ? (str != '' ? 'and ' : '') +
        (a[Number(n[5])] || b[n[5][0]] + ' ' + a[n[5][1]]) +
        'only '
      : '';
  return str;
});

handlebars.registerHelper('splitHead', function (str) {
  return str.split(' ')[0];
});

handlebars.registerHelper('objectLookup', function (obj, key) {
  return obj[key];
});

handlebars.registerHelper('formatDate', function (date, format) {
  return dayjs(date).format(format);
});

handlebars.registerHelper('useRootData', function (context) {
  return context.data.root;
});

handlebars.registerHelper('formatAddress', function (address) {
  let addressStr = '';
  if (address.line1) addressStr += address.line1 + ', ';
  if (address.line2) addressStr += address.line2 + ', ';
  if (address.city) addressStr += address.city + ', ';
  if (address.state) addressStr += address.state + ', ';
  addressStr += address.pincode;
  return addressStr;
});

module.exports = handlebars;
