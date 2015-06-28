var express = require('express');
var app     = express();
var port    = 1337;


app.use(express.static(__dirname + '/public'));
require('./app/routes')(app, express);

app.listen(port);
console.log("                                                        ");
console.log("                                                        ");
console.log("                                    __    __            ");
console.log("                                   69MM  69MM           ");
console.log("                                  6M' ` 6M' `           ");
console.log("    __         ___  __    ___    _MM__ _MM__   ____     ");
console.log("   6MMbMMM     `MM 6MM  6MMMMb   MMMMM MMMMM  6MMMMb    ");
console.log("  6M'`Mb        MM69 \" 8M'  `Mb   MM    MM   6M'  `Mb   ");
console.log("  MM  MM        MM'        ,oMM   MM    MM   MM    MM   ");
console.log("  YM.,M9        MM     ,6MM9'MM   MM    MM   MMMMMMMM   ");
console.log("   YMM9         MM     MM'   MM   MM    MM   MM         ");
console.log("  (M       68b  MM     MM.  ,MM   MM    MM   YM    d9   ");
console.log("   YMMMMb. Y89 _MM_    `YMMM9'Yb._MM_  _MM_   YMMMM9    ");
console.log("  6M    Yb                                              ");
console.log("  YM.   d9                 Acacias this way --> " + port + "    ");
console.log("   YMMMM9                                               ");
console.log("                                                        ");
console.log("                                                        ");
