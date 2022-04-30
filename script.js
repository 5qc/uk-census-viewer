// Functions
const request = (url, func) => {
    const client = new XMLHttpRequest()
    client.onreadystatechange = func
    client.open("GET", url, true)
    return client.send()
}
const displayData = (name, popTotal, popMale, popFemale, households) => {
    document.getElementById("postcode-name").innerText = name
    document.getElementById("postcode-population__total").innerText = popTotal
    document.getElementById("postcode-population__male").innerText = popMale
    document.getElementById("postcode-population__female").innerText = popFemale
    document.getElementById("postcode-occupied-households").innerText = households
}
const randomPostcode = () => {
    request("/data/postcode-selectors.txt", function() {
        if (this.readyState === 4 && this.status === 200) {
            const data = this.responseText.split("\n")

            let result = data[Math.floor(Math.random() * data.length)].replace(/^"/g, "").replace(/"$/g, "").replace(/(\s+)/g, " ")
            document.getElementById("postcode-search").value = result.trim()
            document.getElementById("postcode-search").dispatchEvent(new KeyboardEvent("keyup", {"key": "Enter"}))
        }
    })
}
const checkTable = () => {
    const table = document.querySelector(".postcode-table")
    for (let i = 0; i < table.rows.length; i++) {
        const row = table.rows[i]
        if (row.cells[1] !== undefined) {
            const cell = row.cells[1]
            if (cell.innerText === "NaN") cell.innerText = "N/A"
            continue
        } else continue
    }
}

const el = {
    search: document.getElementById("postcode-search"),
    postcode: document.querySelector(".postcode"),
    error: document.querySelector(".postcode-error"),
    random: document.getElementById("random-postcode")
}

document.onkeyup = (e) => {
    if (e.key === "r") if (!el.search.matches(":focus")) randomPostcode()
}

// Get Random One
el.random.onclick = () => {
    randomPostcode()
}

// Request Script
el.search.onkeyup = (e) => {
    if (e.key === "Enter") {
        el.postcode.style.display = "none"
        el.error.style.display = "none"
        let postcodeExists = false, postcodeData = {
            pop: {},
            cob: {
                ns: {},
                eu: {
                    accession: {},
                    rest: {}
                },
                africa: {
                    north: {},
                    centralWestern: {},
                    southEastern: {}
                },
                mea: {
                    middleEast: {},
                    asia: {
                        eastern: {},
                        southern: {},
                        southeast: {},
                        central: {}
                    }
                },
                ac: {
                    northAmerica: {},
                    centralAmerica: {},
                    southAmerica: {},
                    caribbean: {}
                },
                ao: {
                    antarctica: {},
                    australasia: {},
                    oceania: {}
                }
            },
            aoa: {},
            cva: {},
            eg: {
                white: {},
                mixed: {},
                asian: {},
                black: {}
            }
        }
        request("/data/usual-population.csv", function() {
            if (this.readyState === 4 && this.status === 200) {
                const data = this.responseText.split("\n")
        
                for (let i = 0; i < data.length; i++) {
                    if (i !== 0) {
                        const item = data[i].split(",")
                        postcodeData.year = item[0]
                        postcodeData.name = item[1] ? item[1].replace(/^"/, "").replace(/"$/g, "").replace(/\s+/g, " ") : item[1]
                        postcodeData.pop.total = Number(item[4])
                        postcodeData.area = Number(item[10]) / 100
                        postcodeData.pop.density = postcodeData.pop.total / postcodeData.area
                        postcodeData.pop.male = Number(item[5])
                        postcodeData.pop.female = Number(item[6])
                        postcodeData.pop.inHousehold = Number(item[7])
                        postcodeData.pop.inCommEst = Number(item[8])
                        postcodeData.pop.schoolchildren = Number(item[9])
        
                        if (postcodeData.name !== undefined) {
                            if (el.search.value.toUpperCase() === postcodeData.name.toUpperCase()) {
                                postcodeExists = true
                                break
                            } else continue
                        }
                    }
                }
                if (postcodeExists === true) {
                    document.getElementById("postcode-name").innerText = postcodeData.name
                    document.getElementById("postcode-population__density").innerHTML = `${postcodeData.pop.density.toLocaleString()}/km<sup>2</sup>`
                    document.getElementById("postcode-population__total").innerText = postcodeData.pop.total.toLocaleString()
                    document.getElementById("postcode-population__males").innerText = postcodeData.pop.male.toLocaleString()
                    document.getElementById("postcode-population__females").innerText = postcodeData.pop.female.toLocaleString()
                    document.getElementById("postcode-population__in-households").innerText = postcodeData.pop.inHousehold.toLocaleString()
                    document.getElementById("postcode-population__in-comm-est").innerText = postcodeData.pop.inCommEst.toLocaleString()
                    document.getElementById("postcode-population__schoolchildren").innerText = postcodeData.pop.schoolchildren.toLocaleString()

                    document.getElementById("postcode-area").innerHTML = `${postcodeData.area.toLocaleString()} km<sup>2</sup>`
                    checkTable()
                } else if (postcodeExists === false) {
                    el.error.innerText = `"${el.search.value}" was not found in our database.`
                    el.error.style.display = "block"
                }
            }
        })
        request("/data/ethnic-groups.csv", function() {
            if (this.readyState === 4 && this.status === 200) {
                const data = this.responseText.split("\n")

                for (let i = 0; i < data.length; i++) {
                    if (i !== 0) {
                        const item = data[i].split(",")
                        postcodeData.name = item[1].replace(/^"/, "").replace(/"$/g, "").replace(/\s+/g, " ")
                        postcodeData.eg.white.total = Number(item[5])
                        postcodeData.eg.white.ewsnib = Number(item[6])
                        postcodeData.eg.white.irish = Number(item[7])
                        postcodeData.eg.white.gypsyIrishTraveller = Number(item[8])
                        postcodeData.eg.white.other = Number(item[9])
                        
                        postcodeData.eg.mixed.total = Number(item[10])
                        postcodeData.eg.mixed.whiteBlackCaribbean = Number(item[11])
                        postcodeData.eg.mixed.whiteBlackAfrican = Number(item[12])
                        postcodeData.eg.mixed.whiteAsian = Number(item[13])
                        postcodeData.eg.mixed.other = Number(item[14])

                        postcodeData.eg.asian.total = Number(item[15])
                        postcodeData.eg.asian.indian = Number(item[16])
                        postcodeData.eg.asian.pakistani = Number(item[17])
                        postcodeData.eg.asian.bangladeshi = Number(item[18])
                        postcodeData.eg.asian.chinese = Number(item[19])
                        postcodeData.eg.asian.other = Number(item[20])

                        postcodeData.eg.black.total = Number(item[21])
                        postcodeData.eg.black.african = Number(item[22])
                        postcodeData.eg.black.caribbean = Number(item[23])
                        postcodeData.eg.black.other = Number(item[24])

                        postcodeData.eg.arab = Number(item[26])
                        postcodeData.eg.other = Number(item[27])

                        if (postcodeData.name !== undefined) {
                            if (el.search.value.toUpperCase() === postcodeData.name.toUpperCase()) {
                                postcodeExists = true
                                break
                            } else continue
                        }
                    }
                }
                if (postcodeExists === true) {
                    document.getElementById("postcode-eg__white").innerText = postcodeData.eg.white.total.toLocaleString()
                    document.getElementById("postcode-eg__white-ewsnib").innerText = postcodeData.eg.white.ewsnib.toLocaleString()
                    document.getElementById("postcode-eg__white-irish").innerText = postcodeData.eg.white.irish.toLocaleString()
                    document.getElementById("postcode-eg__white-gypsy-irish-traveller").innerText = postcodeData.eg.white.gypsyIrishTraveller.toLocaleString()
                    document.getElementById("postcode-eg__white-other").innerText = postcodeData.eg.white.other.toLocaleString()

                    document.getElementById("postcode-eg__mixed").innerText = postcodeData.eg.mixed.total.toLocaleString()
                    document.getElementById("postcode-eg__mixed-white-black-caribbean").innerText = postcodeData.eg.mixed.whiteBlackCaribbean.toLocaleString()
                    document.getElementById("postcode-eg__mixed-white-black-african").innerText = postcodeData.eg.mixed.whiteBlackAfrican.toLocaleString()
                    document.getElementById("postcode-eg__mixed-white-asian").innerText = postcodeData.eg.mixed.whiteAsian.toLocaleString()
                    document.getElementById("postcode-eg__mixed-other").innerText = postcodeData.eg.mixed.other.toLocaleString()

                    document.getElementById("postcode-eg__asian").innerText = postcodeData.eg.asian.total.toLocaleString()
                    document.getElementById("postcode-eg__asian-indian").innerText = postcodeData.eg.asian.indian.toLocaleString()
                    document.getElementById("postcode-eg__asian-pakistani").innerText = postcodeData.eg.asian.pakistani.toLocaleString()
                    document.getElementById("postcode-eg__asian-bangladeshi").innerText = postcodeData.eg.asian.bangladeshi.toLocaleString()
                    document.getElementById("postcode-eg__asian-chinese").innerText = postcodeData.eg.asian.chinese.toLocaleString()
                    document.getElementById("postcode-eg__asian-other").innerText = postcodeData.eg.asian.other.toLocaleString()
                    
                    document.getElementById("postcode-eg__black").innerText = postcodeData.eg.black.total.toLocaleString()
                    document.getElementById("postcode-eg__black-african").innerText = postcodeData.eg.black.african.toLocaleString()
                    document.getElementById("postcode-eg__black-caribbean").innerText = postcodeData.eg.black.caribbean.toLocaleString()
                    document.getElementById("postcode-eg__black-other").innerText = postcodeData.eg.black.other.toLocaleString()
                    
                    document.getElementById("postcode-eg__arab").innerText = postcodeData.eg.arab.toLocaleString()
                    document.getElementById("postcode-eg__other").innerText = postcodeData.eg.other.toLocaleString()
                    checkTable()
                }
            }
        })
        request("/data/country-of-birth.csv", function() {
            if (this.readyState === 4 && this.status === 200) {
                const data = this.responseText.split("\n")

                let postcodeExists = false
                for (let i = 0; i < data.length; i++) {
                    if (i !== 0) {
                        const item = data[i].split(",")
                        postcodeData.name = item[1] ? item[1].replace(/^"/, "").replace(/"$/g, "").replace(/\s+/g, " ") : item[1]
                        postcodeData.cob.europe =            Number(item[5])
                        postcodeData.cob.uk =                Number(item[6])
                        postcodeData.cob.england =           Number(item[7])
                        postcodeData.cob.northernIreland =   Number(item[8])
                        postcodeData.cob.scotland =          Number(item[9])
                        postcodeData.cob.wales =             Number(item[10])
                        postcodeData.cob.ns.greatBritian =   Number(item[11])
                        postcodeData.cob.ns.unitedKingdom =  Number(item[12])
                        postcodeData.cob.guernsey =          Number(item[13])
                        postcodeData.cob.jersey =            Number(item[14])
                        postcodeData.cob.ns.channelIslands = Number(item[15])
                        postcodeData.cob.isleOfMan =         Number(item[16])
                        postcodeData.cob.ireland =           Number(item[17])
                        postcodeData.cob.otherEurope =       Number(item[18])
                        postcodeData.cob.eu.total =          Number(item[20])
                        postcodeData.cob.eu.france =         Number(item[21])
                        postcodeData.cob.eu.germany =        Number(item[22])
                        postcodeData.cob.eu.italy =          Number(item[23])
                        postcodeData.cob.eu.portugal =       Number(item[24])
                        postcodeData.cob.eu.spain =          Number(item[25])
                        postcodeData.cob.eu.other =          Number(item[26])

                        postcodeData.cob.eu.accession.total =     Number(item[27])
                        postcodeData.cob.eu.accession.lithuania = Number(item[28])
                        postcodeData.cob.eu.accession.poland =    Number(item[29])
                        postcodeData.cob.eu.accession.romania =   Number(item[30])
                        postcodeData.cob.eu.accession.other =     Number(item[31])

                        postcodeData.cob.eu.rest.total =  Number(item[32])
                        postcodeData.cob.eu.rest.turkey = Number(item[33])
                        postcodeData.cob.eu.rest.other =  Number(item[34])

                        postcodeData.cob.africa.total =                    Number(item[35])
                        postcodeData.cob.africa.north.total =              Number(item[36])
                        postcodeData.cob.africa.centralWestern.total =     Number(item[37])
                        postcodeData.cob.africa.centralWestern.ghana =     Number(item[38])
                        postcodeData.cob.africa.centralWestern.nigeria =   Number(item[39])
                        postcodeData.cob.africa.centralWestern.other =     Number(item[40])
                        postcodeData.cob.africa.southEastern.total =       Number(item[41])
                        postcodeData.cob.africa.southEastern.kenya =       Number(item[42])
                        postcodeData.cob.africa.southEastern.somalia =     Number(item[43])
                        postcodeData.cob.africa.southEastern.southAfrica = Number(item[44])
                        postcodeData.cob.africa.southEastern.zimbabwe =    Number(item[45])
                        postcodeData.cob.africa.southEastern.other =       Number(item[46])
                        postcodeData.cob.ns.africa =                       Number(item[46])

                        postcodeData.cob.mea.total =            Number(item[48])
                        postcodeData.cob.mea.middleEast.total = Number(item[49])
                        postcodeData.cob.mea.middleEast.iran =  Number(item[50])
                        postcodeData.cob.mea.middleEast.other = Number(item[51])

                        postcodeData.cob.mea.asia.eastern.total =    Number(item[52])
                        postcodeData.cob.mea.asia.eastern.china =    Number(item[53])
                        postcodeData.cob.mea.asia.eastern.hongKong = Number(item[54])
                        postcodeData.cob.mea.asia.eastern.other =    Number(item[55])

                        postcodeData.cob.mea.asia.southern.total =      Number(item[56])
                        postcodeData.cob.mea.asia.southern.bangladesh = Number(item[57])
                        postcodeData.cob.mea.asia.southern.india =      Number(item[58])
                        postcodeData.cob.mea.asia.southern.pakistan =   Number(item[59])
                        postcodeData.cob.mea.asia.southern.sriLanka =   Number(item[60])
                        postcodeData.cob.mea.asia.southern.other =      Number(item[61])

                        postcodeData.cob.mea.asia.southeast.total =       Number(item[62])
                        postcodeData.cob.mea.asia.southeast.philippines = Number(item[63])
                        postcodeData.cob.mea.asia.southeast.other =       Number(item[64])

                        postcodeData.cob.mea.asia.central.total =         Number(item[65])

                        postcodeData.cob.ac.total = Number(item[66])
                        postcodeData.cob.ac.northAmerica.total = Number(item[67])
                        postcodeData.cob.ac.northAmerica.unitedStates = Number(item[68])
                        postcodeData.cob.ac.northAmerica.other = Number(item[69])

                        postcodeData.cob.ac.centralAmerica.total = Number(item[70])
                        postcodeData.cob.ac.southAmerica.total = Number(item[71])

                        postcodeData.cob.ac.caribbean.total = Number(item[72])
                        postcodeData.cob.ac.caribbean.jamaica = Number(item[73])
                        postcodeData.cob.ac.caribbean.other = Number(item[74])

                        postcodeData.cob.ao.total = Number(item[75])
                        postcodeData.cob.ao.antarctica.total = Number(item[76])
                        postcodeData.cob.ao.australasia.total = Number(item[77])
                        postcodeData.cob.ao.australasia.australia = Number(item[78])
                        postcodeData.cob.ao.australasia.other = Number(item[79])
                        postcodeData.cob.ao.other = Number(item[76])

                        postcodeData.cob.other = Number(item[77])

                        if (postcodeData.name !== undefined) {
                            if (el.search.value.toUpperCase() === postcodeData.name.toUpperCase()) {
                                postcodeExists = true
                                break
                            } else continue
                        }
                    }
                }
                if (postcodeExists === true) {
                    document.getElementById("postcode-cob__europe").innerText = postcodeData.cob.europe.toLocaleString()
                    document.getElementById("postcode-cob__uk").innerText = postcodeData.cob.uk.toLocaleString()
                    document.getElementById("postcode-cob__england").innerText = postcodeData.cob.england.toLocaleString()
                    document.getElementById("postcode-cob__northern-ireland").innerText = postcodeData.cob.northernIreland.toLocaleString()
                    document.getElementById("postcode-cob__scotland").innerText = postcodeData.cob.scotland.toLocaleString()
                    document.getElementById("postcode-cob__wales").innerText = postcodeData.cob.wales.toLocaleString()
                    document.getElementById("postcode-cob__ns-great-britian").innerText = postcodeData.cob.ns.greatBritian.toLocaleString()
                    document.getElementById("postcode-cob__ns-united-kingdom").innerText = postcodeData.cob.ns.unitedKingdom.toLocaleString()

                    document.getElementById("postcode-cob__channel-islands").innerText = (postcodeData.cob.guernsey + postcodeData.cob.jersey).toLocaleString()
                    document.getElementById("postcode-cob__guernsey").innerText = postcodeData.cob.guernsey.toLocaleString()
                    document.getElementById("postcode-cob__jersey").innerText = postcodeData.cob.jersey.toLocaleString()
                    document.getElementById("postcode-cob__ns-channel-islands").innerText = postcodeData.cob.ns.channelIslands.toLocaleString()
                    document.getElementById("postcode-cob__isle-of-man").innerText = postcodeData.cob.isleOfMan.toLocaleString()
                    document.getElementById("postcode-cob__ireland").innerText = postcodeData.cob.ireland.toLocaleString()

                    document.getElementById("postcode-cob__other-europe").innerText = postcodeData.cob.otherEurope.toLocaleString()
                    document.getElementById("postcode-cob__eu").innerText = postcodeData.cob.eu.total.toLocaleString()
                    document.getElementById("postcode-cob__eu-france").innerText = postcodeData.cob.eu.france.toLocaleString()
                    document.getElementById("postcode-cob__eu-germany").innerText = postcodeData.cob.eu.germany.toLocaleString()
                    document.getElementById("postcode-cob__eu-italy").innerText = postcodeData.cob.eu.italy.toLocaleString()
                    document.getElementById("postcode-cob__eu-portugal").innerText = postcodeData.cob.eu.portugal.toLocaleString()
                    document.getElementById("postcode-cob__eu-spain").innerText = postcodeData.cob.eu.spain.toLocaleString()
                    document.getElementById("postcode-cob__eu-other").innerText = postcodeData.cob.eu.other.toLocaleString()

                    document.getElementById("postcode-cob__eua").innerText = postcodeData.cob.eu.accession.total.toLocaleString()
                    document.getElementById("postcode-cob__eua-lithuania").innerText = postcodeData.cob.eu.accession.lithuania.toLocaleString()
                    document.getElementById("postcode-cob__eua-poland").innerText = postcodeData.cob.eu.accession.poland.toLocaleString()
                    document.getElementById("postcode-cob__eua-romania").innerText = postcodeData.cob.eu.accession.romania.toLocaleString()
                    document.getElementById("postcode-cob__eua-other").innerText = postcodeData.cob.eu.accession.other.toLocaleString()

                    document.getElementById("postcode-cob__europe-rest").innerText = postcodeData.cob.eu.rest.total.toLocaleString()
                    document.getElementById("postcode-cob__europe-rest-turkey").innerText = postcodeData.cob.eu.rest.turkey.toLocaleString()
                    document.getElementById("postcode-cob__europe-rest-other").innerText = postcodeData.cob.eu.rest.other.toLocaleString()

                    document.getElementById("postcode-cob__africa").innerText = postcodeData.cob.africa.total.toLocaleString()
                    document.getElementById("postcode-cob__africa-north").innerText = postcodeData.cob.africa.north.total.toLocaleString()
                    document.getElementById("postcode-cob__africa-central-western").innerText = postcodeData.cob.africa.centralWestern.total.toLocaleString()
                    document.getElementById("postcode-cob__africa-ghana").innerText = postcodeData.cob.africa.centralWestern.ghana.toLocaleString()
                    document.getElementById("postcode-cob__africa-nigeria").innerText = postcodeData.cob.africa.centralWestern.nigeria.toLocaleString()
                    document.getElementById("postcode-cob__africa-central-western-other").innerText = postcodeData.cob.africa.centralWestern.other.toLocaleString()

                    document.getElementById("postcode-cob__africa-south-eastern").innerText = postcodeData.cob.africa.southEastern.total.toLocaleString()
                    document.getElementById("postcode-cob__africa-kenya").innerText = postcodeData.cob.africa.southEastern.kenya.toLocaleString()
                    document.getElementById("postcode-cob__africa-somalia").innerText = postcodeData.cob.africa.southEastern.somalia.toLocaleString()
                    document.getElementById("postcode-cob__africa-south-africa").innerText = postcodeData.cob.africa.southEastern.southAfrica.toLocaleString()
                    document.getElementById("postcode-cob__africa-zimbabwe").innerText = postcodeData.cob.africa.southEastern.zimbabwe.toLocaleString()
                    document.getElementById("postcode-cob__africa-south-eastern-other").innerText = postcodeData.cob.africa.southEastern.other.toLocaleString()
                    document.getElementById("postcode-cob__ns-africa").innerText = postcodeData.cob.ns.africa.toLocaleString()

                    document.getElementById("postcode-cob__mea").innerText = postcodeData.cob.mea.total.toLocaleString()
                    document.getElementById("postcode-cob__mea-middle-east").innerText = postcodeData.cob.mea.middleEast.total.toLocaleString()
                    document.getElementById("postcode-cob__mea-iran").innerText = postcodeData.cob.mea.middleEast.iran.toLocaleString()
                    document.getElementById("postcode-cob__mea-middle-east-other").innerText = postcodeData.cob.mea.middleEast.other.toLocaleString()

                    document.getElementById("postcode-cob__mea-asia").innerText = (postcodeData.cob.mea.asia.eastern.total + postcodeData.cob.mea.asia.southern.total + postcodeData.cob.mea.asia.southeast.total + postcodeData.cob.mea.asia.central.total).toLocaleString()
                    document.getElementById("postcode-cob__mea-eastern-asia").innerText = postcodeData.cob.mea.asia.eastern.total.toLocaleString()
                    document.getElementById("postcode-cob__mea-china").innerText = postcodeData.cob.mea.asia.eastern.china.toLocaleString()
                    document.getElementById("postcode-cob__mea-hong-kong").innerText = postcodeData.cob.mea.asia.eastern.hongKong.toLocaleString()
                    document.getElementById("postcode-cob__mea-eastern-asia-other").innerText = postcodeData.cob.mea.asia.eastern.other.toLocaleString()

                    document.getElementById("postcode-cob__mea-southern-asia").innerText = postcodeData.cob.mea.asia.southern.total.toLocaleString()
                    document.getElementById("postcode-cob__mea-bangladesh").innerText = postcodeData.cob.mea.asia.southern.bangladesh.toLocaleString()
                    document.getElementById("postcode-cob__mea-india").innerText = postcodeData.cob.mea.asia.southern.india.toLocaleString()
                    document.getElementById("postcode-cob__mea-pakistan").innerText = postcodeData.cob.mea.asia.southern.pakistan.toLocaleString()
                    document.getElementById("postcode-cob__mea-sri-lanka").innerText = postcodeData.cob.mea.asia.southern.sriLanka.toLocaleString()
                    document.getElementById("postcode-cob__mea-southern-asia-other").innerText = postcodeData.cob.mea.asia.southern.other.toLocaleString()

                    document.getElementById("postcode-cob__mea-south-east-asia").innerText = postcodeData.cob.mea.asia.southeast.total.toLocaleString()
                    document.getElementById("postcode-cob__mea-philippines").innerText = postcodeData.cob.mea.asia.southeast.philippines.toLocaleString()
                    document.getElementById("postcode-cob__mea-south-east-asia-other").innerText = postcodeData.cob.mea.asia.southeast.other.toLocaleString()

                    document.getElementById("postcode-cob__mea-central-asia").innerText = postcodeData.cob.mea.asia.central.total.toLocaleString()

                    document.getElementById("postcode-cob__ac").innerText = postcodeData.cob.ac.total.toLocaleString()
                    document.getElementById("postcode-cob__ac-north-america").innerText = postcodeData.cob.ac.northAmerica.total.toLocaleString()
                    document.getElementById("postcode-cob__ac-united-states").innerText = postcodeData.cob.ac.northAmerica.unitedStates.toLocaleString()
                    document.getElementById("postcode-cob__ac-north-america-other").innerText = postcodeData.cob.ac.northAmerica.other.toLocaleString()
                    document.getElementById("postcode-cob__ac-central-america").innerText = postcodeData.cob.ac.centralAmerica.total.toLocaleString()
                    document.getElementById("postcode-cob__ac-south-america").innerText = postcodeData.cob.ac.southAmerica.total.toLocaleString()

                    document.getElementById("postcode-cob__ac-caribbean").innerText = postcodeData.cob.ac.caribbean.total.toLocaleString()
                    document.getElementById("postcode-cob__ac-jamaica").innerText = postcodeData.cob.ac.caribbean.jamaica.toLocaleString()
                    document.getElementById("postcode-cob__ac-caribbean-other").innerText = postcodeData.cob.ac.caribbean.other.toLocaleString()

                    document.getElementById("postcode-cob__ao").innerText = postcodeData.cob.ao.total.toLocaleString()
                    document.getElementById("postcode-cob__ao-antarctica").innerText = postcodeData.cob.ao.antarctica.total.toLocaleString()
                    document.getElementById("postcode-cob__ao-australasia").innerText = postcodeData.cob.ao.australasia.total.toLocaleString()
                    document.getElementById("postcode-cob__ao-australia").innerText = postcodeData.cob.ao.australasia.australia.toLocaleString()
                    document.getElementById("postcode-cob__ao-australasia-other").innerText = postcodeData.cob.ao.australasia.other.toLocaleString()
                    document.getElementById("postcode-cob__ao-oceania-other").innerText = postcodeData.cob.ao.other.toLocaleString()
                    
                    document.getElementById("postcode-cob__other").innerText = postcodeData.cob.other.toLocaleString()
                    checkTable()
                }
            }
        })
        request("/data/age-of-arrival.csv", function() {
            if (this.readyState === 4 && this.status === 200) {
                const data = this.responseText.split("\n")
        
                for (let i = 0; i < data.length; i++) {
                    if (i !== 0) {
                        const item = data[i].split(",")
                        postcodeData.year = item[0]
                        postcodeData.name = item[1] ? item[1].replace(/^"/, "").replace(/"$/g, "").replace(/\s+/g, " ") : item[1]
        
                        postcodeData.aoa.born = Number(item[5])
                        postcodeData.aoa.one = Number(item[6])
                        postcodeData.aoa.two = Number(item[7])
                        postcodeData.aoa.three = Number(item[8])
                        postcodeData.aoa.four = Number(item[9])
                        postcodeData.aoa.five = Number(item[10])
                        postcodeData.aoa.six = Number(item[11])
                        postcodeData.aoa.seven = Number(item[12])
                        postcodeData.aoa.eight = Number(item[13])
                        postcodeData.aoa.nine = Number(item[14])
                        postcodeData.aoa.ten = Number(item[15])
                        postcodeData.aoa.eleven = Number(item[16])
                        postcodeData.aoa.twelve = Number(item[17])
                        postcodeData.aoa.thirteen = Number(item[18])
                        postcodeData.aoa.fourteen = Number(item[19])
                        postcodeData.aoa.fifteen = Number(item[20])
                        postcodeData.aoa.sixteen = Number(item[21])

                        if (postcodeData.name !== undefined) {
                            if (el.search.value.toUpperCase() === postcodeData.name.toUpperCase()) {
                                postcodeExists = true
                                break
                            } else continue
                        }
                    }
                }
                if (postcodeExists === true) {
                    document.getElementById("postcode-aoa__born").innerText = postcodeData.aoa.born.toLocaleString()
                    document.getElementById("postcode-aoa__0-4").innerText = postcodeData.aoa.one.toLocaleString()
                    document.getElementById("postcode-aoa__5-7").innerText = postcodeData.aoa.two.toLocaleString()
                    document.getElementById("postcode-aoa__8-9").innerText = postcodeData.aoa.three.toLocaleString()
                    document.getElementById("postcode-aoa__10-14").innerText = postcodeData.aoa.four.toLocaleString()
                    document.getElementById("postcode-aoa__15").innerText = postcodeData.aoa.five.toLocaleString()
                    document.getElementById("postcode-aoa__16-17").innerText = postcodeData.aoa.six.toLocaleString()
                    document.getElementById("postcode-aoa__18-19").innerText = postcodeData.aoa.seven.toLocaleString()
                    document.getElementById("postcode-aoa__20-24").innerText = postcodeData.aoa.eight.toLocaleString()
                    document.getElementById("postcode-aoa__25-29").innerText = postcodeData.aoa.nine.toLocaleString()
                    document.getElementById("postcode-aoa__30-44").innerText = postcodeData.aoa.ten.toLocaleString()
                    document.getElementById("postcode-aoa__45-59").innerText = postcodeData.aoa.eleven.toLocaleString()
                    document.getElementById("postcode-aoa__60-64").innerText = postcodeData.aoa.twelve.toLocaleString()
                    document.getElementById("postcode-aoa__65-74").innerText = postcodeData.aoa.thirteen.toLocaleString()
                    document.getElementById("postcode-aoa__75-84").innerText = postcodeData.aoa.fourteen.toLocaleString()
                    document.getElementById("postcode-aoa__85-89").innerText = postcodeData.aoa.fifteen.toLocaleString()
                    document.getElementById("postcode-aoa__90-over").innerText = postcodeData.aoa.sixteen.toLocaleString()
                    checkTable()
                }
            }
        })
        request("/data/car-or-van-availability.csv", function() {
            if (this.readyState === 4 && this.status === 200) {
                const data = this.responseText.split("\n")

                for (let i = 0; i < data.length; i++) {
                    if (i !== 0) {
                        const item = data[i].split(",")
                        postcodeData.year = item[0]
                        postcodeData.name = item[1] ? item[1].replace(/^"/, "").replace(/"$/g, "").replace(/\s+/g, " ") : item[1]

                        postcodeData.cva.total = Number(item[10])
                        postcodeData.cva.zero = Number(item[4])
                        postcodeData.cva.one = Number(item[5])
                        postcodeData.cva.two = Number(item[6])
                        postcodeData.cva.three = Number(item[7])
                        postcodeData.cva.fourPlus = Number(item[8])

                        if (postcodeData.name !== undefined) {
                            if (el.search.value.toUpperCase() === postcodeData.name.toUpperCase()) {
                                postcodeExists = true
                                break
                            } else continue
                        }
                    }
                }
                if (postcodeExists === true) {
                    document.getElementById("postcode-cva__total").innerText = postcodeData.cva.total.toLocaleString()
                    document.getElementById("postcode-cva__zero").innerText = postcodeData.cva.zero.toLocaleString()
                    document.getElementById("postcode-cva__one").innerText = postcodeData.cva.one.toLocaleString()
                    document.getElementById("postcode-cva__two").innerText = postcodeData.cva.two.toLocaleString()
                    document.getElementById("postcode-cva__three").innerText = postcodeData.cva.three.toLocaleString()
                    document.getElementById("postcode-cva__four-plus").innerText = postcodeData.cva.fourPlus.toLocaleString()

                    el.postcode.style.display = "block"
                    checkTable()
                }
            }
        })
    }
}