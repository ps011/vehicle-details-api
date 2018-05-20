var http = require('http'),
 url = require('url'),
request = require('request'),
cheerio = require('cheerio');
http.createServer(function(req, res) {
  var q = url.parse(req.url, true).query;
  var data = {
  'javax.faces.partial.ajax':'true',
  'javax.faces.source': 'form_rcdl:j_idt32',
  'javax.faces.partial.execute':'@all',
  'javax.faces.partial.render': 'form_rcdl:pnl_show form_rcdl:pg_show form_rcdl:rcdl_pnl',
  'form_rcdl:j_idt32':'form_rcdl:j_idt32',
  'form_rcdl':'form_rcdl',
  'form_rcdl:tf_reg_no1': q.first,
  'form_rcdl:tf_reg_no2': q.second
};
request.post({url: 'https://parivahan.gov.in/rcdlstatus/'}, function(err, httpResponse, html) {
    const $ = cheerio.load(html);
    var token = $('input[name="javax.faces.ViewState"]').val();
    var cookies = httpResponse.headers['set-cookie'];
    data['javax.faces.ViewState'] = token;
    var headers = {
      'Cookie': cookies
  };
request.post({url: 'https://parivahan.gov.in/rcdlstatus/', form: data, headers: headers}, function(err2, httpResponse2, html2){
var vehicleDetailsPage = cheerio.load(html2);
var response = {};
vehicleDetailsPage('table').find('td').each(function(index, element) {
  if(vehicleDetailsPage(this).children().length) {
    if(vehicleDetailsPage(this).children().hasClass('font-bold')) {
      response[vehicleDetailsPage(this).children().text()] =
       vehicleDetailsPage(this).next().children().length ?
       (vehicleDetailsPage(this).next().children().hasClass('font-bold') ? '' : vehicleDetailsPage(this).next().children().text())
       : vehicleDetailsPage(this).next().text();
    }
  }
})
res.write(JSON.stringify(response));
res.end();
});
});
}).listen(8080);
