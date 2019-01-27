var fmdata = [];
var fmdatafull = [];

const denverZip1 = [80237]

const denverZip = [80237,
  80236,
  80239,
  80238,
  80243,
  80246,
  80247,
  80250,
  80249,
  80261,
  80263,
  80266,
  80271,
  80291,
  80123,
  80202,
  80201,
  80204,
  80203,
  80206,
  80205,
  80208,
  80207,
  80210,
  80209,
  80212,
  80211,
  80217,
  80216,
  80219,
  80218,
  80221,
  80220,
  80223,
  80222,
  80224,
  80227,
  80231,
  80230,
  80235,
]

function getMarket(callback) {
  zipArray = denverZip;
  getMarketList(zipArray)
  callback
}


function getMarketList(zipArray) {
  for (var i = 0; i < zipArray.length; i++ ) {
    getMarketId(zipArray[i])
  }
}

function getMarketId(zip) {
  const url = "https://search.ams.usda.gov/farmersmarkets/v1/data.svc/zipSearch?zip=" + zip;
  fetch(url)
    .then(res => res.json())
    .then(data => data.results)
    .then(data => {
      for (var i = 0; i < data.length; i++) {
        getMarketDetail(data[i].id, data[i].marketname, zip)
      }
    })
}

function getMarketDetail(id, name = 'unavailable', zip) {
  const url = "https://search.ams.usda.gov/farmersmarkets/v1/data.svc/mktDetail?id=" + id;
  fetch(url)
    .then(res => res.json())
    .then(data => fmdata.push({zip, name, ...data.marketdetails}))
}

function convertArrayOfObjectsToCSV(args) {
  var result, ctr, keys, columnDelimiter, lineDelimiter, data, entry;

  data = args.data || null;
  if (data == null || !data.length) {
    return null;
  }

  columnDelimiter = args.columnDelimiter || ',';
  lineDelimiter = args.lineDelimiter || '\n';

  keys = Object.keys(data[0]);

  result = '';
  result += keys.join(columnDelimiter);
  result += lineDelimiter;

  data.forEach(function(item) {
    ctr = 0;
    keys.forEach(function(key) {
      if (ctr > 0) {
        result += columnDelimiter;
      }
      result += item[key];
      ctr++;
    })
    result += lineDelimiter;
  })

  return result;
}

function downloadCSV(args) {
  var data, filename, link;
  scrubCommasFromArrayOfObjects(fmdata)
  var csv = convertArrayOfObjectsToCSV({data: fmdata});

  if (csv == null) return;

  filename = args.filename || 'export.csv';
  
  if (!csv.match(/^data:text\/csv/i)) {
    csv = 'data:text/csv;charset=utf-8,' + csv;
  }

  data = encodeURI(csv);

  link = document.createElement('a');
  link.setAttribute('href', data);
  link.setAttribute('download', filename);
  link.click();
}

function scrubCommasFromArrayOfObjects(data) {
  for (var i = 0; i < data.length; i++) {
    const keys = Object.keys(data[i])
    for (const key of keys) {
      const raw = data[i][key]
      var poo = ''
      if (typeof(raw) === "string") {
        poo = raw.replace(/,/g, "|")
        data[i][key] = poo
      }
    }
  }
}