/*!
Copyright © 2006-2007 Kevin C. Olbrich
Copyright © 2010-2013 LIM SAS (http://lim.eu) - Julien Sanchez
Copyright © 2015 Native Dynamics (nativedynamics.com.au) - Trevor Walker

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

(function (root, factory) {
    "use strict";

	if(typeof define === "function" && define.amd)
	{
		define('NeutriumJS/Qty', ['NeutriumJS/utilities/nestedMap'], factory);
	}
	else if (typeof exports === "object")
	{
		module.exports = factory(require('NeutriumJS.utilities.nestedMap'));
	}
	else
	{
		root.NeutriumJS = root.NeutriumJS || {};
		root.NeutriumJS.Qty = factory(root.NeutriumJS.utilities.nestedMap);
	}
}(this, function(NestedMap) {
	"use strict";

	var PREFIXES = {
			"<googol>"	: [["googol"], 1e100],
			"<kibi>"	: [["Ki","Kibi","kibi"], Math.pow(2,10)],
			"<mebi>"	: [["Mi","Mebi","mebi"], Math.pow(2,20)],
			"<gibi>"	: [["Gi","Gibi","gibi"], Math.pow(2,30)],
			"<tebi>"	: [["Ti","Tebi","tebi"], Math.pow(2,40)],
			"<pebi>"	: [["Pi","Pebi","pebi"], Math.pow(2,50)],
			"<exi>"		: [["Ei","Exi","exi"], Math.pow(2,60)],
			"<zebi>"	: [["Zi","Zebi","zebi"], Math.pow(2,70)],
			"<yebi>"	: [["Yi","Yebi","yebi"], Math.pow(2,80)],
			"<yotta>"	: [["Y","Yotta","yotta"], 1e24],
			"<zetta>"	: [["Z","Zetta","zetta"], 1e21],
			"<exa>"		: [["E","Exa","exa"], 1e18],
			"<peta>"	: [["P","Peta","peta"], 1e15],
			"<tera>"	: [["T","Tera","tera"], 1e12],
			"<giga>"	: [["G","Giga","giga"], 1e9],
			"<mega>"	: [["M","Mega","mega"], 1e6],
			"<kilo>"	: [["k","kilo"], 1e3],
			"<hecto>"	: [["h","Hecto","hecto"], 1e2],
			"<deca>"	: [["da","Deca","deca","deka"], 1e1],
			"<deci>"	: [["d","Deci","deci"], 1e-1],
			"<centi>"	: [["c","Centi","centi"], 1e-2],
			"<milli>"	: [["m","Milli","milli"], 1e-3],
			"<micro>"	: [["u","\u03BC","\u00B5","Micro","mc","micro"], 1e-6],
			"<nano>"	: [["n","Nano","nano"], 1e-9],
			"<pico>"	: [["p","Pico","pico"], 1e-12],
			"<femto>"	: [["f","Femto","femto"], 1e-15],
			"<atto>"	: [["a","Atto","atto"], 1e-18],
			"<zepto>"	: [["z","Zepto","zepto"], 1e-21],
			"<yocto>"	: [["y","Yocto","yocto"], 1e-24]
		},

		UNITS = {
			"": {
				units: {
					"<1>"	: [["1", "<1>"], 1],
				}
			},
			acceleration: {
				numerator: ["<meter>"],
				denominator: ["<second>","<second>"],
				units: {
					"<gee>"	: [["gee", "gforce", "gn"], 9.80665],
				}
			},
			angle: {
				numerator: ["<radian>"],
				units: {
					"<radian>" 		:[["rad","radian","radians"], 1.0],
					"<degree>" 		:[["deg","degree","degrees"], Math.PI / 180.0],
					"<gradian>" 	:[["gon","grad","gradian","grads"], Math.PI / 200.0],
					"<aminutes>" 	: [["amin","amins"], 0.0002908882],
					"<aseconds>" 	: [["asec", "asecs"], 4.8481366667e-6],
					"<amils>" 		: [["amil", "amils"], 9.817477e-4],
					"<octant>" 		: [["octant"], 0.785398163],
					"<quadrant>" 	: [["quadrant", "quadrants"], 1.570796327],
					"<sextant>" 	: [["sextant"], 1.047197551],
					"<rev>"			: [["rev"], 6.283185307],
					"<compass-pt>"	: [["cpoint"], 0.196349540849362],
					//"<steradian>"  : [["sr","steradian","steradians"], 1.0, "solid_angle", ["<steradian>"]]
				}
			},
			area: {
				numerator: ["<meter>","<meter>"],
				units: {
					"<acre>"	: [["acre","acres"], 4046.856422],
					"<acre-us>"	: [["acre(us)","acres(us)"], 4046.873],
					"<ares>"	: [["are","ares"], 100],
					"<barn>"	: [["barn","barns"], 1E-28],
					"<dunam>"	: [["dunam"], 1000],
					"<hectare>"	: [["ha", "hectare"], 10000],
					"<rood>"	: [["rood","roods"], 1011.714106]
				}
			},
			capacitance: {
				numerator: ["<ampere>","<second>"],
				units: {
					"<farad>" :  [["F","farad","Farad"], 1.0],
				}
			},
			charge: {
				numerator: ["<ampere>","<second>"],
				units: {
					"<coulomb>" :  [["C","coulomb","Coulomb"], 1.0],
					"<esu>" 	:  [["ESU", "esu", "Fr", "statC", "StatC"], 3.335640952e-10],
				}
			},
			currency: {
				numerator:["<dollar>"],
				units: {
					"<dollar>":[["dollar", "dollars"], 1.0],
					"<cents>" :[["cents"], 0.01],
				}
			},
			current: {
				numerator: ["<ampere>"],
				units: {
					"<ampere>"  	:  [["A","Ampere","ampere","amp","amps"], 1.0],
					"<biot>"		:  [["Biot"], 10],
					"<statampere>"	:  [["StatAmpere", "statA", "StatA"], 3.335641E-10]
				}
			},
			data: {
				numerator: ["<byte>"],
				units: {
					"<byte>" :[["B","byte"], 1.0],
					"<bit>" :[["b","bit"], 0.125],
					"<nibble>" :[["nibble"], 0.5],
				}
			},
			electricalConductance: {
				numerator: ["<second>","<second>","<second>","<ampere>","<ampere>"],
				denominator: ["<kilogram>","<meter>","<meter>"],
				units: {
					"<siemens>" : [["S","Siemen", "Siemens","siemens", "mho", "mhos"], 1.0],
					"<statmho>" : [["statmho"], 1.112347052e-12]
				}
			},
			electricalInductance: {
				numerator: ["<meter>","<meter>","<kilogram>"],
				denominator: ["<second>","<second>","<ampere>","<ampere>"],
				units: {
					"<henry>" 	:  [["H","Henry","henry"], 1],
					"<abhenry>" :  [["abH"], 1E-9],
					"<statH>" 	:  [["statH", "StatH"], 8.987552E+11],
				}
			},
			electricalPotential: {
				numerator: ["<meter>","<meter>","<kilogram>"],
				denominator: ["<second>","<second>","<second>","<ampere>"],
				units: {
					"<volt>"		:  [["V","Volt","volt","volts"], 1.0],
					"<abvolt>"		:  [["abV", "abVolt"], 1E-8],
					"<statvolts>"	:  [["statV"], 299.7925]
				}
			},
			electricalResistance: {
				numerator: ["<meter>","<meter>","<kilogram>"],
				denominator: ["<second>","<second>","<second>","<ampere>","<ampere>"],
				units: {
					"<ohm>" : [["Ohm","ohm","\u03A9"/*? as greek letter*/,"\u2126"/*? as ohm sign*/], 1.0],
					"<abohm>" : [["abOhm"], 1e-9]
				}
			},
			energy: {
				numerator: ["<meter>","<meter>","<kilogram>"],
				denominator: ["<second>","<second>"],
				units: {
					"<btu>"   			: [["BTU","btu","BTUs", "Btu"], 1055.055853],
					"<btu-thermo>"		: [["BTU(th)","btu(th)", "btus(th)", "Btu(th)"], 1054.35026444],	// British Thermal Units (Thermochemical)
					"<calorie>" 		: [["cal","calorie","calories"], 4.1868],
					"<calorie-IUNS>" 	: [["cal(N)"], 4.182],		// IUNS Calorie
					"<calorie-thermo>" 	: [["cal(th)"], 4.184],	// Calories (Thermochemical)
					"<erg>"   			: [["erg","ergs"], 1e-7],
					"<electron-volts>"	: [["eV"], 1.60217653e-19],
					"<joule>" 			: [["J","joule","Joule","joules"], 1.0],
					"<therm-euro>" 		: [["thm","therm","therms","Therm"], 105505590],
					"<therm-US>" 		: [["thm(us)","therm(us)","therms(us)","Therm(us)"], 105480400],
					"<TNT>" 			: [["tTNT"], 4184000000],
				}
			},
			force: {
				numerator: ["<kilogram>","<meter>"],
				denominator: ["<second>","<second>"],
				units: {
					"<newton>"  		: [["N", "Newton","newton"], 1.0],
					"<dyne>"  			: [["dyn", "dyne"], 1e-5],
					"<gram-force>"  	: [["gf", "gram-force", "pond"], 0.00980665],
					"<kg-force>"  		: [["kgf", "kg-force", "kpond"], 9.80665],
					"<pound-force>"		: [["lbf", "pound-force"], 4.448221615],
					"<ounce-force>"		: [["ozf", "ounce-force"], 0.278013851],
					"<poundal>"			: [["pdl", "poundal"], 0.138254954],
					"<tonne-force>"		: [["tf", "tonnef"], 9806.65],
					"<ton-force-long>"	: [["tonlf"], 9964.016418],
					"<ton-force-short>"	: [["tonsf"], 8896.4432],
				}
			},
			frequency: {
				numerator: ["<radian>"],
				denominator: ["<second>"],
				units: {
					"<hertz>"	: [["Hz","hertz","Hertz", "pers"], 2*Math.PI],
					"<rpm>"		: [["rpm", "RPM"], 2*Math.PI/60],
				}
			},
			length: {
				numerator: ["<meter>"],
				units: {
					"<meter>" 			: [["m","meter","meters","metre","metres"], 1.0],
					"<angstrom>"		: [["Å", "ang","angstrom","angstroms"], 1e-10],
					"<AU>"				: [["AU", "au","astronomical-unit"], 149597870700],
					"<caliber>"			: [["caliber",], 0.0254],
					"<chain>"			: [["chain", "chains",], 20.1168],
					"<chain-us>"		: [["chain(us)"], 20.116840234],
					"<cubit>"			: [["cubit",], 0.4572],
					"<cubit-long>"		: [["lcubit",], 0.5334],
					"<fathom>"			: [["fathom","fathoms"], 1.8288],
					"<fermi>"			: [["Fermi"], 1e-15],
					"<finger>"			: [["finger","fingers"], 0.1143],
					"<foot>"			: [["ft","foot","feet","'"], 0.3048],
					"<furlong>"			: [["furlong","furlongs"], 201.168],
					"<furlong-us>"		: [["furlong(us)", "furlong(uss)"], 201.16840234],
					"<hand>"			: [["hand","hands"], 0.1016],
					"<league>"			: [["league", "nleague(us)"], 4828.0417],	// Need to check this is the same as nleage(us)
					"<inch>"			: [["in","inch","inches","\""], 0.0254],
					"<link>"			: [["link","links"], 0.201168],
					"<link-us>"			: [["link(us)"], 0.20116840234],
					"<light-minute>"	: [["lmin","light-minute"], 17987547480],
					"<light-second>"	: [["ls","light-second"], 299792458],
					"<light-year>"		: [["ly","light-year"], 9460730472580800],
					"<micron>"			: [["micron"], 1e-6],
					"<mil>"				: [["mil","mils"], 0.0000254, ["<meter>"]],
					"<mile>"			: [["mi","mile","miles"], 1609.344],
					"<nail>"			: [["nail","nails"], 0.05715],
					"<naut-league>"		: [["nleague"], 5556],
					"<naut-league-uk>"	: [["nleague(uk)"], 5559.552],
					"<naut-mile>"		: [["nmi"], 1852],
					"<parsec>"			: [["pc","parsec","parsecs"], 30856780000000000],
					"<pica>"			: [["pica","picas"], 0.00423333333],
					"<planck-length>"	: [["Planck"], 1.616252E-35],
					"<point>"			: [["pt","point","points"], 0.000352777777777778],
					"<rod>"				: [["rd","rod","rods"], 5.0292],
					"<rod-us>"			: [["rod(us)"], 5.029210058],
					"<rope>"			: [["rope", "ropes"], 6.096],
					"<span>"			: [["span"], 0.2286],
					"<yard>"			: [["yd","yard","yards"], 0.9144]
				}
			},
			magneticFlux: {
				numerator: ["<meter>","<meter>","<kilogram>"],
				denominator: ["<second>","<second>","<ampere>"],
				units: {
					"<weber>"	: [["Wb","weber","webers"], 1.0],
					"<maxwell>" : [["Mx","maxwell","maxwells"], 1e-8],
					"<line>" 	: [["line"], 1E-8]
				}
			},
			magneticFluxDensity: {
				numerator: ["<kilogram>"],
				denominator: ["<second>","<second>","<ampere>"],
				units: {
					"<tesla>"  : [["T","tesla","teslas"], 1],
					"<gauss>" : [["G","gauss"], 1e-4]
				}
			},
			mass: {
				numerator: ["<kilogram>"],
				units: {
					"<kilogram>"	: [["kg","kilogram","kilograms"], 1.0],
					"<AMU>" 		: [["u","AMU","amu"], 1.660538921e-27],
					"<carat>"		: [["ct","carat","carats"], 0.0002],
					"<dalton>" 		: [["Da","Dalton","Daltons","dalton","daltons"], 1.660538921e-27],
					"<dram>"		: [["dram","drams","dr"], 0.0017718452],
					"<gram>"		: [["g","gram","grams","gramme","grammes"], 1e-3],
					"<grain>"		: [["grain","grains","gr"], 6.479891E-5],
					"<pound>"		: [["lbs","lb","pound","pounds","#"], 0.45359237],
					"<pound-troy>"	: [["lbt"], 0.3732417],
					"<ounce>"		: [["oz","ounce","ounces"], 0.0283495231],
					"<ounce-troy>"	: [["ozt"], 0.031103477],
					"<slug>" 		: [["slug","slugs"], 14.5939029],
					"<stone>" 		: [["stone","stones","st"],6.35029318],
					"<ton-metric>"	: [["t", "tonne"], 1000],
					"<ton-long>"	: [["tnl","tonl"], 1016.0469088],
					"<ton-short>"	: [["tn","ton", "tons"], 907.18474],
				}
			},
			power: {
				numerator: ["<kilogram>","<meter>","<meter>"],
				denominator: ["<second>","<second>","<second>"],
				units: {
					"<watt>"  				: [["W","watt","watts"], 1.0],
					"<horsepower>"  		: [["Hp", "hp","horsepower"], 745.699872],
					"<horsepower-electric>"	: [["Hp(e)", "hp(e)","horsepower-e","hp(electric)"], 746],
					"<horsepower-metric>"	: [["Hp(m)", "hp(m)", "Hp(m)"], 735.49875]
				}
			},
			pressure: {
				numerator: ["<kilogram>"],
				denominator: ["<meter>","<second>","<second>"],
				units: {
					"<pascal>"	: [["Pa","pascal","Pascal"], 1.0],
					"<at>" 		: [["at"], 98066.5], // Technical Atmosphere
					"<atm>" 	: [["atm","atmosphere","atmospheres"], 101325],	// Standard atmospheres
					"<bar>" 	: [["bar","bars"], 100000],
					"<barye>" 	: [["barye"], 0.1],
					"<cmh2o>" 	: [["cmH2O"], 98.0638],
					"<cmHg>" 	: [["cmHg"], 1333.223874],
					"<inh2o>"	: [["inH2O"], 249.082052],
					"<inHg>" 	: [["inHg"], 3386.3881472],
					"<mmh2o>" 	: [["mmH2O"], 9.80665],
					"<mmHg>" 	: [["mmHg"], 133.322387415],
					"<pieze>" 	: [["pieze"], 1000],
					"<psf>" 	: [["psf"], 47.880259],	// Pounds per foor squared
					"<psi>" 	: [["psi"], 6894.757293],
					"<torr>" 	: [["torr"], 133.322368],
				}
			},
			radiation: {
				numerator: ["<meter>","<meter>"],
				denominator: ["<second>","<second>"],
				units: {
					"<gray>"		: [["Gy","gray","grays"], 1.0],
					"<roentgen>"	: [["R","roentgen"], 0.009330],
					"<sievert>"		: [["Sv","sievert","sieverts"], 1.0]
				}
			},
			radioactivity: {
				numerator: ["<1>"],
				denominator: ["<second>"],
				units: {
					"<becquerel>"	: [["Bq","bequerel","bequerels"], 1.0],
					"<curie>"		: [["Ci","curie","curies"], 3.7e10]
				}
			},
			sound: {
				numerator: ["<bel>"],
				units: {
					"<bel>" : [["Bels", "Bel"], 1],
					"<neper>" : [["Neper"], 0.8686]
				}
			},
			substance: {
				numerator: ["<mole>"],
				units: {
					"<mole>"  :  [["mol","mole"], 1.0],
				}
			},
			temperature: {
				numerator: ["<kelvin>"],
				units: {
					"<kelvin>" 		: [["degK","kelvin", "K"], 1.0],
					"<celsius>" 	: [["degC","celsius","celsius","centigrade", "C"], 1.0],
					"<fahrenheit>" 	: [["degF","fahrenheit", "F"], 5/9],
					"<rankine>" 	: [["degR","rankine", "R"], 5/9],
					"<temp-K>"  	: [["tempK"], 1.0],
					"<temp-C>"  	: [["tempC"], 1.0],
					"<temp-F>"  	: [["tempF"], 5/9],
					"<temp-R>"  	: [["tempR"], 5/9],
				}
			},
			time: {
				numerator: ["<second>"],
				units: {
					"<second>"			: [["s","sec","secs","second","seconds"], 1],
					"<minute>"			: [["min","mins","minute","minutes"], 60],
					"<hour>"			: [["h","hr","hrs","hour","hours"], 3600],
					"<day>"				: [["d","day","days"], 86400],
					"<week>"			: [["wk","week","weeks"], 604800],
					"<fortnight>"		: [["fortnight","fortnights"], 1209600],
					"<month>"			: [["month", "months"], 2629740],
					"<year>"			: [["y","yr","year","years","annum"], 31536000],
					"<year-julian>"		: [["y(j)","yr(j)","year(j)","years(j)"], 31557600],	// Checks out
					"<year-leap>"		: [["y(l)","yr(l)","year(l)","years(l)"], 31622400],
					"<year-tropical>"	: [["tyr", "tyrs"], 31556925.19],
					"<decade>"			: [["decade","decades"], 315360000],
					"<century>"			: [["century","centuries"], 3153600000],
					"<millienia>"		: [["millienia","millenium"], 31536000000],
					"<shake>"			: [["shake"], 1e-8],
				}
			},
			velocity: {
				numerator: ["<meter>"],
				denominator: ["<second>"],
				units: {
					"<kph>"			: [["kph"], 0.277777778],
					"<mph>"			: [["mph"], 0.44704],
					"<knot>"		: [["kn","knot","knots"], 0.514444444],
					"<mach>"		: [["mach"], 295.0464],
					"<light-speed>"	: [["lspeed", "light"], 299792458]
				}
			},
			viscosity: {	// Dynamic viscosity
				numerator: ["<kilogram>"],
				denominator: ["<meter>","<second>"],
				units: {
					"<poise>"	: [["P","poise"], 0.1],
					"<reyn>"	: [["reyn"], 6894.75729]
				}
			},
			viscosityKinematic: {
				numerator: ["<meter>", "<meter>"],
				denominator: ["<second>"],
				units: {
					"<stoke>"	: [["St", "Stokes"], 1E-4]
				}
			},
			volume: {
				numerator: ["<meter>","<meter>","<meter>"],
				units: {
					"<barrels-us-petroleum>": [["bbl(us)", "bbl"], 0.158987295],
					"<barrels-uk>" 			: [["bl(uk)", "bl(imp)"], 0.16365924],
					"<barrels-us-dry>" 		: [["bl(usd)"], 0.115627124],
					"<barrels-us-liquid>" 	: [["bl(usl)"], 0.119240471],
					"<bushels-us>"			: [["bu","bsh","bushel","bushel(us)"], 0.035239072],
					"<bushels-uk>"			: [["bu(uk)", "bushel(uk)", "bushel(imp)"], 0.03636872],
					"<cup-metric>" 			: [["cup", "cup(metric)"], 0.00025],
					"<cup-imperial>" 		: [["cup(imp)"], 2.84130625e-4],
					"<cup-us-customary>"	: [["cup(usc)"], 2.365882365e-4],
					"<cup-us-legal>"		: [["cup(usl)"], 0.00024],
					"<dram>"				: [["dram","drams"], 3.6966911953E-06],
					"<drum-metric-petroleum>": [["drum(mp)"], 0.2],
					"<drum-us-petroleum>"	: [["drum(usp)"], 0.208197648],
					"<fluid-ounce>"			: [["floz","fluid-ounce","fluid-ounces"], 2.84130625e-5],
					"<fluid-ounce-us>"		: [["oz(usl)", "floz(us)"], 2.95735296e-5],
					"<gallon-uk>"			: [["gal", "gal(imp)", "gal(uk)"], 0.00454609],
					"<gallon-us-dry>"		: [["gal(usd)","gal(us dry)"], 0.004404884],
					"<gallon-us-liquid>"	: [["gal(us)", "gal(usl)","gal(us fl)"], 0.003785412],
					"<liter>" 				: [["l","L","liter","liters","litre","litres"], 0.001],
					"<pecks-uk>" 			: [["peck(uk)","pecks(uk)"], 0.00909218],
					"<pecks-us>" 			: [["peck(us)","pecks(us)"], 0.008809768],
					"<pint>"				: [["pt","pint","pints", "pint(us fl)"], 0.000473176475],
					"<pint-uk>"				: [["pt(uk)","pint(uk)","pints(uk)"], 0.00056826125],
					"<pint-us-dry>"			: [["pt(usd)","pint(usd)","pints(usd)"], 0.000550610475],
					"<pint-us-liquid>"		: [["pt(usl)","pint(usl)","pints(usl)"], 0.000473176473],
					"<quart>"				: [["qt","quart","quarts"], 0.00094635295],		// US liquid
					"<quart-uk>"			: [["qt(uk)","quart(uk)","quarts(uk)"], 0.0011365225],
					"<quart-us-dry>"		: [["qt(usd)","quart(usd)","quarts(usd)"], 1.10122095e-3],
					"<quart-us-liquid>"		: [["qt(usl)","quart(usl)","quarts(usl)"], 9.46352946e-4],
					"<tablespoon-metric>"	: [["tb","tbs","tablespoon","tablespoons"], 0.000015],
					"<tablespoon-uk>"		: [["tb(uk)", "tbs(uk)","tablespoon(uk)","tablespoons(uk)"], 1.420653125e-5],
					"<tablespoon-us>"		: [["tb(us)", "tbs(us)","tablespoon(us)","tablespoons(us)"], 1.478676478125e-5],
					"<teaspoon-metric>"		: [["tsp","teaspoon","teaspoons"], 0.000005],
					"<teaspoon-us>"			: [["tsp(us)","teaspoon(us)","teaspoons(us)"], 4.92892161e-6],
				}
			}
		};

	var BASE_UNITS = ["<meter>", "<kilogram>", "<second>", "<mole>", "<farad>", "<ampere>", "<radian>", "<kelvin>", "<temp-K>", "<byte>", "<dollar>", "<candela>", "<each>", "<steradian>", "<bel>"],
		SIGNATURE_VECTOR = ["length", "time", "temperature", "mass", "current", "substance", "luminosity", "currency", "data", "angle", "capacitance"],
		UNITY = "<1>",
		UNITY_ARRAY= [UNITY],
		parsedUnitsCache = {},
		baseUnitCache = {},
		stringifiedUnitsCache = new NestedMap(),
		PREFIX_VALUES = {},
		PREFIX_MAP = {},
		UNIT_VALUES = {},
		UNIT_MAP = {},
		OUTPUT_MAP = {};

	// Regular expressions
	var SIGN = "[+-]",
		INTEGER = "\\d+",
		SIGNED_INTEGER = SIGN + "?" + INTEGER,
		FRACTION = "\\." + INTEGER,
		FLOAT = "(?:" + INTEGER + "(?:" + FRACTION + ")?" + ")" + "|" + "(?:" + FRACTION + ")",
		EXPONENT = "[Ee]" + SIGNED_INTEGER,
		SCI_NUMBER = "(?:" + FLOAT + ")(?:" + EXPONENT + ")?",
		SIGNED_NUMBER = SIGN + "?\\s*" + SCI_NUMBER,
		QTY_STRING = "(" + SIGNED_NUMBER + ")?" + "\\s*([^/]*)(?:\/(.+))?",
		QTY_STRING_REGEX = new RegExp("^" + QTY_STRING + "$"),
		POWER_OP = "\\^|\\*{2}",
		TOP_REGEX = new RegExp ("([^ \\*.]+?)(?:" + POWER_OP + ")?(-?\\d+)(?![A-z])"),
		BOTTOM_REGEX = new RegExp("([^ \\*.]+?)(?:" + POWER_OP + ")?(\\d+)"),
		BOUNDARY_REGEX = "\\b|\\s|$",
		// REGEX defined during module initalisation
		PREFIX_REGEX,
		UNIT_REGEX,
		UNIT_MATCH,
		UNIT_MATCH_REGEX,
		UNIT_TEST_REGEX;

	// Initalise the module
	(function() {
		var definition = null;

		for(var prefix in PREFIXES)
		{
			definition = PREFIXES[prefix];
			PREFIX_VALUES[prefix] = definition[1];
			OUTPUT_MAP[prefix] = definition[0][0];

			for(var i = 0; i < definition[0].length; i++)
			{
				PREFIX_MAP[definition[0][i]] = prefix;
			}
		}

		for(var categoryDef in UNITS)
		{
			var category = UNITS[categoryDef];

			for(var unitDef in category.units)
			{
				definition = category.units[unitDef];

				UNIT_VALUES[unitDef] = {
					scalar: definition[1],
					numerator: category.numerator,
					denominator: category.denominator,
					category: categoryDef
				};

				for(var j = 0; j < definition[0].length; j++)
				{
					UNIT_MAP[definition[0][j]] = unitDef;
				}

				// Might not need output map
				OUTPUT_MAP[unitDef] = definition[0][0];
			}
		}

		PREFIX_REGEX = Object.keys(PREFIX_MAP).sort(function(a, b) {
			return b.length - a.length;
		}).join("|");

		UNIT_REGEX = Object.keys(UNIT_MAP).sort(function(a, b) {
			return b.length - a.length;
		}).join("|").replace(/(\(|\))/g, '\\$1');

		//Minimal boundary regex to support units with Unicode characters. \b only works for ASCII
		UNIT_MATCH = "(" + PREFIX_REGEX + ")??(" + UNIT_REGEX + ")(?:" + BOUNDARY_REGEX + ")";
		UNIT_MATCH_REGEX = new RegExp(UNIT_MATCH, "g"); // g flag for multiple occurences
		//UNIT_TEST_REGEX = new RegExp("^\\s*(" + UNIT_MATCH + "\\s*\\*?\\s*)+$");
		UNIT_TEST_REGEX = new RegExp("^\\s*(" + UNIT_MATCH + "\\s*(\\.?|\\*?)\\s*)+$");	// Try also to get . as in kg.s as kg*s
	})();

	//
	// Define the Qty object
	//
	function Qty(initValue)
	{
		assertValidInitializationValueType(initValue);

		if(!(isQty(this)))
		{
			return new Qty(initValue);
		}

		this.scalar = null;
		this.baseScalar = null;
		this.signature = null;
		this._conversionCache = {};
		this.numerator = UNITY_ARRAY;
		this.denominator = UNITY_ARRAY;

		if (isDefinitionObject(initValue))
		{
			this.scalar = initValue.scalar;
			this.numerator = (initValue.numerator && initValue.numerator.length !== 0)? initValue.numerator : UNITY_ARRAY;
			this.denominator = (initValue.denominator && initValue.denominator.length !== 0)? initValue.denominator : UNITY_ARRAY;
		}
		else
		{
			parse.call(this, initValue);
		}

		// math with temperatures is very limited
		if(this.denominator.join("*").indexOf("temp") >= 0)
		{
			throw new Exception("Cannot divide with temperatures");
		}

		if(this.numerator.join("*").indexOf("temp") >= 0)
		{
			if(this.numerator.length > 1)
			{
				throw new Exception("Cannot multiply by temperatures");
			}

			if(!compareArray(this.denominator, UNITY_ARRAY))
			{
				throw new Exception("Cannot divide with temperatures");
			}
		}

		this.initValue = initValue;
		updateBaseScalar.call(this);

		if(this.isTemperature() && this.baseScalar < 0)
		{
			throw new Exception("Temperatures must not be less than absolute zero");
		}
	}

	Qty.prototype = {
		//
		// Converts to other compatible units.
		// Instance's converted quantities are cached for faster subsequent calls.
		//
		// @param {(string|Qty)} other - Target units as string or retrieved from
		//                               other Qty instance (scalar is ignored)
		//
		// @returns {Qty} New converted Qty instance with target units
		//
		// @throws {QtyError} if target units are incompatible
		//
		// @example
		// var weight = Qty("25 kg");
		// weight.to("lb"); // => Qty("55.11556554621939 lbs");
		// weight.to(Qty("3 g")); // => Qty("25000 g"); // scalar of passed Qty is ignored
		//
		to : function(other)
		{
			var cached, target;

			if(!other)
			{
				return this;
			}

			if(!isString(other))
			{
				return this.to(other.units());
			}

			cached = this._conversionCache[other];

			if(cached)
			{
				return cached;
			}

			// Instantiating target to normalize units
			target = new Qty(other);

			if(target.units() === this.units())
			{
				return this;
			}

			if(!this.isCompatible(target))
			{
				if(this.isInverse(target))
				{
					target = this.inverse().to(other);
				}
				else
				{
					throwIncompatibleUnits();
				}
			}
			else
			{
				if(target.isTemperature())
				{
					target = toTemp(this,target);
				}
				else if(target.isDegrees())
				{
					target = toDegrees(this,target);
				}
				else
				{
					var q = this.baseScalar/target.baseScalar;
					target = new Qty({
						scalar: q,
						numerator:
						target.numerator,
						denominator: target.denominator
					});
				}
			}

			this._conversionCache[other] = target;

			return target;
		},

		//
		// check to see if units are compatible, but not the scalar part
		// this check is done by comparing signatures for performance reasons
		// if passed a string, it will create a unit object with the string and then do the comparison
		// this permits a syntax like:
		// unit =~ "mm"
		//if you want to do a regexp on the unit string do this ...
		// unit.units =~ /regexp/
		//
		isCompatible : function(other)
		{
			if(isString(other))
			{
				return this.isCompatible(new Qty(other));
			}

			if(!(isQty(other)))
			{
				return false;
			}

			if(other.signature !== undefined)
			{
				return this.signature === other.signature;
			}
			else
			{
				return false;
			}
		},

		// convert to base SI units
		// results of the conversion are cached so subsequent calls to this will be fast
		toBase : function()
		{
			if(this.isBase())
			{
				return this;
			}

			if(this.isTemperature())
			{
				return toTempK(this);
			}

			var cached = baseUnitCache[this.units()];

			if(!cached)
			{
				cached = toBaseUnits(this.numerator, this.denominator);
				baseUnitCache[this.units()] = cached;
			}

			return cached.mul(this.scalar);
		},

		isBase : function()
		{
			if(this._isBase !== undefined)
			{
				return this._isBase;
			}

			if(this.isDegrees() && this.numerator[0].match(/<(kelvin|temp-K)>/))
			{
				this._isBase = true;
				return this._isBase;
			}

			this.numerator.concat(this.denominator).forEach(function(item) {
				if(item !== UNITY && BASE_UNITS.indexOf(item) === -1 )
				{
					this._isBase = false;
				}
			}, this);

			if(this._isBase === false)
			{
				return this._isBase;
			}

			this._isBase = true;

			return this._isBase;
		},

		// Returns a Qty that is the inverse of this Qty,
		inverse : function()
		{
			if(this.isTemperature())
			{
				throw new Exception("Cannot divide with temperatures");
			}

			if(this.scalar === 0)
			{
				throw new Exception("Divide by zero");
			}

			return new Qty({
				scalar: 1/this.scalar,
				numerator: this.denominator,
				denominator: this.numerator
			});
		},

		isInverse : function(other)
		{
			return this.inverse().isCompatible(other);
		},

		units : function()
		{
			if(this._units !== undefined)
			{
				return this._units;
			}

			var numIsUnity = compareArray(this.numerator, UNITY_ARRAY),
				denIsUnity = compareArray(this.denominator, UNITY_ARRAY);

			if(numIsUnity && denIsUnity)
			{
				this._units = "";
				return this._units;
			}

			var numUnits = stringifyUnits(this.numerator),
				denUnits = stringifyUnits(this.denominator);

			this._units = numUnits + (denIsUnity ? "":("/" + denUnits));

			return this._units;
		},

		isDegrees : function()
		{
			// signature may not have been calculated yet
			return (this.signature === null || this.signature === 400) &&
					this.numerator.length === 1 &&
					compareArray(this.denominator, UNITY_ARRAY) &&
					(this.numerator[0].match(/<temp-[CFRK]>/) || this.numerator[0].match(/<(kelvin|celsius|rankine|fahrenheit)>/));
		},

		isTemperature : function()
		{
			return this.isDegrees() && this.numerator[0].match(/<temp-[CFRK]>/);
		},

		// returns true if no associated units
	    // false, even if the units are "unitless" like 'radians, each, etc'
	    isUnitless : function()
		{
			return compareArray(this.numerator, UNITY_ARRAY) && compareArray(this.denominator, UNITY_ARRAY);
	    },

		//
		// Mathematical operations on quantities
		//
		add : function(other)
		{
			if(isString(other))
			{
				other = new Qty(other);
			}

			if(!this.isCompatible(other))
			{
				throwIncompatibleUnits();
			}

			if(this.isTemperature() && other.isTemperature())
			{
				throw new Exception("Cannot add two temperatures");
			}
			else if(this.isTemperature())
			{
				return addTempDegrees(this,other);
			}
			else if(other.isTemperature())
			{
				return addTempDegrees(other,this);
			}

			return new Qty({
				scalar: this.scalar + other.to(this).scalar,
				numerator: this.numerator,
				denominator: this.denominator
			});
		},

		sub : function(other)
		{
			if(isString(other))
			{
				other = new Qty(other);
			}

			if(!this.isCompatible(other))
			{
				throwIncompatibleUnits();
			}

			if(this.isTemperature() && other.isTemperature())
			{
				return subtractTemperatures(this,other);
			}
			else if(this.isTemperature())
			{
				return subtractTempDegrees(this,other);
			}
			else if(other.isTemperature())
			{
				throw new Exception("Cannot subtract a temperature from a differential degree unit");
			}

			return new Qty({
				scalar: this.scalar - other.to(this).scalar,
				numerator: this.numerator,
				denominator: this.denominator
			});
		},

		mul : function(other)
		{
			if(isNumber(other))
			{
				return new Qty({
					scalar: this.scalar*other,
					numerator: this.numerator,
					denominator: this.denominator
				});
			}
			else if(isString(other))
			{
				other = new Qty(other);
			}

			if((this.isTemperature()||other.isTemperature()) && !(this.isUnitless()||other.isUnitless()))
			{
				throw new Exception("Cannot multiply by temperatures");
			}

			// Quantities should be multiplied with same units if compatible, with base units else
			var op1 = this,
				op2 = other;

			// so as not to confuse results, multiplication and division between temperature degrees will maintain original unit info in num/den
			// multiplication and division between deg[CFRK] can never factor each other out, only themselves: "degK*degC/degC^2" == "degK/degC"
			if(op1.isCompatible(op2) && op1.signature !== 400)
			{
				op2 = op2.to(op1);
			}

			var numden = cleanTerms(op1.numerator.concat(op2.numerator), op1.denominator.concat(op2.denominator));

			return new Qty({
				scalar: op1.scalar*op2.scalar,
				numerator: numden[0],
				denominator: numden[1]
			});
		},

		div : function(other) {
			if(isNumber(other))
			{
				if(other === 0)
				{
					throw new Exception("Divide by zero");
				}

				return new Qty({"scalar": this.scalar / other, "numerator": this.numerator, "denominator": this.denominator});
			}
			else if(isString(other))
			{
				other = new Qty(other);
			}

			if(other.scalar === 0)
			{
				throw new Exception("Divide by zero");
			}

			if(other.isTemperature())
			{
				throw new Exception("Cannot divide with temperatures");
			}
			else if(this.isTemperature() && !other.isUnitless())
			{
				throw new Exception("Cannot divide with temperatures");
			}

			// Quantities should be multiplied with same units if compatible, with base units else
			var op1 = this,
				op2 = other;

			// so as not to confuse results, multiplication and division between temperature degrees will maintain original unit info in num/den
			// multiplication and division between deg[CFRK] can never factor each other out, only themselves: "degK*degC/degC^2" == "degK/degC"
			if(op1.isCompatible(op2) && op1.signature !== 400)
			{
				op2 = op2.to(op1);
			}

			var numden = cleanTerms(op1.numerator.concat(op2.denominator), op1.denominator.concat(op2.numerator));

			return new Qty({
				scalar: op1.scalar / op2.scalar,
				numerator: numden[0],
				denominator: numden[1]
			});
		},

		// Comparative functions
		// Compare two Qty objects. Throws an exception if they are not of compatible types.
	    // Comparisons are done based on the value of the quantity in base SI units.
	    //
	    // NOTE: We cannot compare inverses as that breaks the general compareTo contract:
	    //   if a.compareTo(b) < 0 then b.compareTo(a) > 0
	    //   if a.compareTo(b) == 0 then b.compareTo(a) == 0
	    //
	    //   Since "10S" == ".1ohm" (10 > .1) and "10ohm" == ".1S" (10 > .1)
	    //     Qty("10S").inverse().compareTo("10ohm") == -1
	    //     Qty("10ohm").inverse().compareTo("10S") == -1
	    //
	    //   If including inverses in the sort is needed, I suggest writing: Qty.sort(qtyArray,units)
	    compareTo: function(other)
		{
			if(isString(other))
			{
				return this.compareTo(new Qty(other));
			}

			if(!this.isCompatible(other))
			{
				throwIncompatibleUnits();
			}

			if(this.baseScalar < other.baseScalar)
			{
				return -1;
			}
			else if(this.baseScalar === other.baseScalar)
			{
				return 0;
			}
			else if(this.baseScalar > other.baseScalar)
			{
				return 1;
			}
		},

		eq: function(other)
		{
			return this.compareTo(other) === 0;
		},

		lt: function(other)
		{
			return this.compareTo(other) === -1;
		},

		lte: function(other)
		{
			return this.eq(other) || this.lt(other);
		},

		gt: function(other)
		{
			return this.compareTo(other) === 1;
		},

		gte: function(other)
		{
			return this.eq(other) || this.gt(other);
		},

		// Return true if quantities and units match
		// Unit("100 cm").same(Unit("100 cm"))  # => true
		// Unit("100 cm").same(Unit("1 m"))     # => false
		same: function(other)
		{
			return (this.scalar === other.scalar) && (this.units() === other.units());
		}
	};


	// Parse a string into a unit object.
	// Typical formats like :
	// "5.6 kg*m/s^2"
	// "5.6 kg*m*s^-2"
	// "5.6 kilogram*meter*second^-2"
	// "2.2 kPa"
	// "37 degC"
	// "1"  -- creates a unitless constant with value 1
	// "GPa"  -- creates a unit with scalar 1 with units 'GPa'
	// 6'4"  -- recognized as 6 feet + 4 inches
	// 8 lbs 8 oz -- recognized as 8 lbs + 8 ounces
	//
	var parse = function(val)
	{

		val = (val + '').trim();

		if (val.length === 0)
		{
			throw new Exception("Unit not recognized");
		}

		var result = QTY_STRING_REGEX.exec(val);

		if(!result)
		{
			throw new Exception(val + ": Quantity not recognized");
		}

		var scalarMatch = result[1];

		if(scalarMatch)
		{
			// Allow whitespaces between sign and scalar for loose parsing
			scalarMatch = scalarMatch.replace(/\s/g, "");
			this.scalar = parseFloat(scalarMatch);
		}
		else
		{
			this.scalar = 1;
		}

		var top = result[2],
			bottom = result[3],
			n, x, nx;

		// TODO DRY me
		while((result = TOP_REGEX.exec(top)))
		{
			n = parseFloat(result[2]);

			if(isNaN(n))
			{
				// Prevents infinite loops
				throw new Exception("Unit exponent is not a number");
			}

			// Disallow unrecognized unit even if exponent is 0
			if(n === 0 && !UNIT_TEST_REGEX.test(result[1]))
			{
				throw new Exception("Unit not recognized");
			}

			x = result[1] + " ";
			nx = "";

			for(var i = 0; i < Math.abs(n) ; i++)
			{
				nx += x;
			}

			if(n >= 0)
			{
				top = top.replace(result[0], nx);
			}
			else
			{
				bottom = bottom ? bottom + nx : nx;
				top = top.replace(result[0], "");
			}
		}

		while((result = BOTTOM_REGEX.exec(bottom)))
		{
			n = parseFloat(result[2]);

			if(isNaN(n))
			{
				// Prevents infinite loops
				throw new Exception("Unit exponent is not a number");
			}

			// Disallow unrecognized unit even if exponent is 0
			if(n === 0 && !UNIT_TEST_REGEX.test(result[1]))
			{
				throw new Exception("Unit not recognized");
			}

			x = result[1] + " ";
			nx = "";

			for(var j = 0; j < n ; j++)
			{
				nx += x;
			}

			bottom = bottom.replace(result[0], nx, "g");
		}

		if(top)
		{
			this.numerator = parseUnits(top.trim());
		}

		if(bottom)
		{
			this.denominator = parseUnits(bottom.trim());
		}
	};

	//
	// Parses and converts units string to normalized unit array.
	// Result is cached to speed up next calls.
	//
	// @param {string} units Units string
	// @returns {string[]} Array of normalized units
	//
	// @example
	// // Returns ["<second>", "<meter>", "<second>"]
	// parseUnits("s m s");
	//
	function parseUnits(units)
	{
		var cacheKey = units,
			cached = parsedUnitsCache[units],
			unitMatch,
			normalizedUnits = [];

		if(cached)
		{
			return cached;
		}

		// Strip out
		units = units.replace(/(\.|\*)/g, ' ');

		// Scan
		if(!UNIT_TEST_REGEX.test(units))
		{
			throw new Exception("Unit not recognized");
		}

		while((unitMatch = UNIT_MATCH_REGEX.exec(units)))
		{
			normalizedUnits.push(unitMatch.slice(1));
		}

		normalizedUnits = normalizedUnits.map(function(item) {
			return PREFIX_MAP[item[0]] ? [PREFIX_MAP[item[0]], UNIT_MAP[item[1]]] : [UNIT_MAP[item[1]]];
		});

		// Flatten and remove null elements
		normalizedUnits = normalizedUnits.reduce(function(a,b) {
			return a.concat(b);
		}, []);

		normalizedUnits = normalizedUnits.filter(function(item) {
			return item;
		});

		parsedUnitsCache[cacheKey] = normalizedUnits;

		return normalizedUnits;

	}

	function toBaseUnits (numerator,denominator)
	{
		var num = [],
			den = [],
			q = 1,
			unit;

		for(var i = 0; i < numerator.length; i++)
		{
			unit = numerator[i];

			if(PREFIX_VALUES[unit])
			{
				q *= PREFIX_VALUES[unit];
			}
			else
			{
				unit = UNIT_VALUES[unit];

				if(unit)
				{
					q *= unit.scalar;

					if(unit.numerator)
					{
						num.push(unit.numerator);
					}

					if(unit.denominator)
					{
						den.push(unit.denominator);
					}
				}
			}
		}

		for(var j = 0; j < denominator.length; j++)
		{
			unit = denominator[j];

			if(PREFIX_VALUES[unit])
			{
				q /= PREFIX_VALUES[unit];
			}
			else
			{
				unit = UNIT_VALUES[unit];

				if(unit)
				{
					q /= unit.scalar;

					if(unit.numerator)
					{
						den.push(unit.numerator);
					}

					if(unit.denominator)
					{
						num.push(unit.denominator);
					}
				}
			}
		}

		// Flatten
		num = num.reduce(function(a,b) {
			return a.concat(b);
		}, []);

		den = den.reduce(function(a,b) {
			return a.concat(b);
		}, []);

		return new Qty({
			scalar: q,
			numerator: num,
			denominator: den
		});
	}

	// Temperature handling functions

	function toTemp(src,dst)
	{
		var dstUnits = dst.units(),
			dstScalar;

		switch(dstUnits)
		{
			case "tempK":
				dstScalar = src.baseScalar; break;
			case "tempC":
				dstScalar = src.baseScalar - 273.15; break;
			case "tempF":
				dstScalar = (src.baseScalar * 9/5) - 459.67; break;
			case "tempR":
				dstScalar = src.baseScalar * 9/5; break;
			default:
				throw new QtyError("Unknown type for temp conversion to: " + dstUnits);
		}

		return new Qty({
			scalar: dstScalar,
			numerator: dst.numerator,
			denominator: dst.denominator
		});
	}

	function toTempK(qty)
	{
		var units = qty.units(),
			q;

		if(units.match(/(deg)[CFRK]/))
		{
			q = qty.baseScalar;
		}
		else
		{
			switch(units)
			{
				case "tempK": q = qty.scalar; break;
				case "tempC": q = qty.scalar + 273.15; break;
				case "tempF": q = (qty.scalar + 459.67) * 5/9; break;
				case "tempR": q = qty.scalar * 5/9; break;
				default:
					throw new QtyError("Unknown type for temp conversion from: " + units);
			}
		}

		return new Qty({
			scalar: q,
			numerator: ["<temp-K>"],
			denominator: UNITY_ARRAY
		});
	}

	function toDegrees(src,dst)
	{
		var srcDegK = toDegK(src),
			dstUnits = dst.units(),
			dstScalar;

		switch(dstUnits)
		{
			case "degK": dstScalar = srcDegK.scalar; break;
			case "degC": dstScalar = srcDegK.scalar; break;
			case "degF": dstScalar = srcDegK.scalar * 9/5; break;
			case "degR": dstScalar = srcDegK.scalar * 9/5; break;
			default:
				throw new Exception("Unknown type for degree conversion to: " + dstUnits);
		}

		return new Qty({
			scalar: dstScalar,
			numerator: dst.numerator,
			denominator: dst.denominator
		});
	}

	function toDegK(qty)
	{
		var units = qty.units(),
			q;

		if(units.match(/(deg)[CFRK]/))
		{
			q = qty.baseScalar;
		}
		else
		{
			switch(units)
			{
				case "tempK": q = qty.scalar; break;
				case "tempC": q = qty.scalar; break;
				case "tempF": q = qty.scalar * 5/9; break;
				case "tempR": q = qty.scalar * 5/9; break;
				default: throw new Exception("Unknown type for temp conversion from: " + units);
			}
		}

		return new Qty({
			scalar: q,
			numerator: ["<kelvin>"],
			denominator: UNITY_ARRAY
		});
	}


	function subtractTemperatures(lhs,rhs)
	{
		var lhsUnits = lhs.units(),
			rhsConverted = rhs.to(lhsUnits);
			dstDegrees = new Qty(getDegreeUnits(lhsUnits));

		return new Qty({
			scalar: lhs.scalar - rhsConverted.scalar,
			numerator: dstDegrees.numerator,
			denominator: dstDegrees.denominator
		});
	}

	function subtractTempDegrees(temp,deg)
	{
		var tempDegrees = deg.to(getDegreeUnits(temp.units()));

		return new Qty({
			scalar: temp.scalar - tempDegrees.scalar,
			numerator: temp.numerator,
			denominator: temp.denominator
		});
	}

	function addTempDegrees(temp,deg)
	{
		var tempDegrees = deg.to(getDegreeUnits(temp.units()));

		return new Qty({
			scalar: temp.scalar + tempDegrees.scalar,
			numerator: temp.numerator,
			denominator: temp.denominator
		});
	}

	// converts temp[CKFR] to deg[CKFR]
	function getDegreeUnits(units)
	{
		var degrees = 'CKFR',
			unit = units.slice(-1);

		if(degrees.indexOf(unit) !== -1)
		{
			return 'deg' + unit;
		}
		else
		{
			throw new Exception("Unknown type for temp conversion from: " + units);
		}
	}

	var updateBaseScalar = function()
	{
		if(this.baseScalar)
		{
			return this.baseScalar;
		}

		if(this.isBase())
		{

			this.baseScalar = this.scalar;
			this.signature = unitSignature.call(this);
		}
		else
		{
			var base = this.toBase();
			this.baseScalar = base.scalar;
			this.signature = base.signature;
		}
	};

	//
	// Calculates the unit signature id for use in comparing compatible units and simplification
	// the signature is based on a simple classification of units and is based on the following publication
	//
	// Novak, G.S., Jr. "Conversion of units of measurement", IEEE Transactions on Software Engineering,
	// 21(8), Aug 1995, pp.651-661
	// doi://10.1109/32.403789
	// http://www.cs.utexas.edu/~novak/units95.html
	//
	var unitSignature = function()
	{
		if(this.signature)
		{
			return this.signature;
		}

		var vector = unitSignatureVector.call(this);

		for(var i = 0; i < vector.length; i++)
		{
			vector[i] *= Math.pow(20, i);	// Not sure if this equation is correct
		}

		return vector.reduce(function(previous, current) {return previous + current;}, 0);
	};

	// calculates the unit signature vector used by unit_signature
	var unitSignatureVector = function()
	{
		if(!this.isBase())
		{
			return unitSignatureVector.call(this.toBase());
		}

		var vector = new Array(SIGNATURE_VECTOR.length),
			r, n;

		for(var i = 0; i < vector.length; i++)
		{
			vector[i] = 0;
		}

		// Numerator - ["<kilogram>","<meter>"]
		for(var j = 0; j < this.numerator.length; j++)
		{
			//Units - "<newton>"  : [["N","Newton","newton"], 1.0, "force", ["<kilogram>","<meter>"], ["<second>","<second>"]],
			if((r = UNIT_VALUES[this.numerator[j]]))
			{
				n = SIGNATURE_VECTOR.indexOf(r.category);

				//SIGNATURE_VECTOR = ["length", "time", "temperature", "mass", "current", "substance", "luminosity", "currency", "memory", "angle", "capacitance"];
				if(n >= 0)
				{
					vector[n] = vector[n] + 1;
				}
			}
		}

		for(var k = 0; k < this.denominator.length; k++)
		{
			if((r = UNIT_VALUES[this.denominator[k]]))
			{
				n = SIGNATURE_VECTOR.indexOf(r.category);

				if(n >= 0)
				{
					vector[n] = vector[n] - 1;
				}
			}
		}

		return vector;
	};

	//
	// Utility Functions
	//

	//
	// Tests if a value is a string
	//
	// @param {} value - Value to test
	//
	// @returns {boolean} true if value is a string, false otherwise
	//
	function isString(value)
	{
		return typeof value === "string" || value instanceof String;
	}

	function compareArray(array1, array2)
	{
		if (array2.length !== array1.length) {
			return false;
		}

		for (var i = 0; i < array1.length; i++)
		{
			if (array2[i].compareArray)
			{
				if (!array2[i].compareArray(array1[i]))
				{
					return false;
				}
			}

			if (array2[i] !== array1[i])
			{
				return false;
			}
		}
		return true;
	}

	//
	// Returns a string representing a normalized unit array
	//
	// @param {string[]} units Normalized unit array
	// @returns {string} String representing passed normalized unit array and suitable for output
	//
	function stringifyUnits(units)
	{
		var stringified = stringifiedUnitsCache.get(units);

		if(stringified) {
			return stringified;
		}

		var isUnity = compareArray(units, UNITY_ARRAY);

		if(isUnity)
		{
			stringified = "1";
		}
		else
		{
			stringified = simplify(getOutputNames(units)).join("*");
		}

		// Cache result
		stringifiedUnitsCache.set(units, stringified);

		return stringified;
	}

	// this turns ['s','m','s'] into ['s2','m']
	function simplify (units) {
		function reduce(acc, unit)
		{
			var unitCounter = acc[unit];

			if(!unitCounter)
			{
				acc.push(unitCounter = acc[unit] = [unit, 0]);
			}

			unitCounter[1]++;

			return acc;
		}

		var unitCounts = units.reduce(reduce, []);

		return unitCounts.map(function(unitCount) {
			return unitCount[0] + (unitCount[1] > 1 ? unitCount[1] : "");
		});
	}

	function getOutputNames(units)
	{
		var unitNames = [], token, tokenNext;

		for(var i = 0; i < units.length; i++)
		{
			token = units[i];
			tokenNext = units[i+1];

			if(PREFIX_VALUES[token])
			{
				unitNames.push(OUTPUT_MAP[token] + OUTPUT_MAP[tokenNext]);
				i++;
			}
			else
			{
				unitNames.push(OUTPUT_MAP[token]);
			}
		}
		return unitNames;
	}

	function cleanTerms(num, den)
	{
		num = num.filter(function(val) {return val !== UNITY;});
		den = den.filter(function(val) {return val !== UNITY;});

		var combined = {},
			k;

		for(var i = 0; i < num.length; i++)
		{
			if(PREFIX_VALUES[num[i]])
			{
				k = [num[i], num[i+1]];
				i++;
			}
			else
			{
				k = num[i];
			}

			if(k && k !== UNITY) {
				if(combined[k])
				{
					combined[k][0]++;
				}
				else
				{
					combined[k] = [1, k];
				}
			}
		}

		for(var j = 0; j < den.length; j++)
		{
			if(PREFIX_VALUES[den[j]])
			{
				k = [den[j], den[j+1]];
				j++;
			}
			else
			{
				k = den[j];
			}

			if(k && k !== UNITY)
			{
				if(combined[k])
				{
					combined[k][0]--;
				}
				else
				{
					combined[k] = [-1, k];
				}
			}
		}

		num = [];
		den = [];

		for(var prop in combined)
		{
			if(combined.hasOwnProperty(prop))
			{
				var item = combined[prop],
					n;

				if(item[0] > 0)
				{
					for(n = 0; n < item[0]; n++)
					{
						num.push(item[1]);
					}
				}
				else if(item[0] < 0)
				{
					for(n = 0; n < -item[0]; n++)
					{
						den.push(item[1]);
					}
				}
			}
		}

		if(num.length === 0)
		{
			num = UNITY_ARRAY;
		}

		if(den.length === 0)
		{
			den = UNITY_ARRAY;
		}

		// Flatten
		num = num.reduce(function(a,b) {
			return a.concat(b);
		}, []);

		den = den.reduce(function(a,b) {
			return a.concat(b);
		}, []);

		return [num, den];
	}

	//
	// Prefer stricter Number.isFinite if currently supported.
	// To be dropped when ES6 is finalized. Obsolete browsers will
	// have to use ES6 polyfills.
	//
	var isFinite = Number.isFinite || window.isFinite;

	//
	// Tests if a value is a number
	//
	// @param {} value - Value to test
	//
	// @returns {boolean} true if value is a number, false otherwise
	//
	function isNumber(value)
	{
		// Number.isFinite allows not to consider NaN or '1' as numbers
		return isFinite(value);
	}

	//
	// Tests if a value is a Qty instance
	//
	// @param {} value - Value to test
	//
	// @returns {boolean} true if value is a Qty instance, false otherwise
	//
	function isQty(value)
	{
		return value instanceof Qty;
	}

	//
	// Tests if a value is a Qty definition object
	//
	// @param {} value - Value to test
	//
	// @returns {boolean} true if value is a definition object, false otherwise
	//
	function isDefinitionObject(value)
	{
		return value && typeof value === "object" && value.hasOwnProperty("scalar");
	}

	//
	// Asserts initialization value type is valid
	//
	// @param {} value - Value to test
	//
	// @throws {Exception} if initialization value type is not valid
	//
	function assertValidInitializationValueType(value)
	{
		if (!(isString(value) || isNumber(value) || isQty(value) || isDefinitionObject(value)))
		{
			throw new Exception("Only strings, numbers or quantities accepted as initialization values");
		}
	}

	/*
	* Throws incompatible units error
	*
	* @throws "Incompatible units" error
	*/
	function throwIncompatibleUnits()
	{
		throw new Exception("Incompatible units");
	}

  	function Exception(message)
	{
		this.name = 'NeutriumJS/Convert Exception';
		this.message = message;
	}

	return Qty;
}));
