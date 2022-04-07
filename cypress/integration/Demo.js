describe('Testing https://deckofcardsapi.com/', () => {
    const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '0', 'J', 'Q', 'K']
    const suitsInitial = ['S', 'D', 'C', 'H']
    const suitsFull = ['SPADES', 'DIAMONDS', 'CLUBS', 'HEARTS']
    const imageURL = 'https://deckofcardsapi.com/static/img/'
    it('Various Tests with a Deck with Jokers', () => {
        cy.log('Create a New Deck with Jokers')
        cy.request('new?jokers_enabled=true')
        .then((response) => {
            expect(response.body).to.have.property('success', true)
            expect(response.body).to.have.property('deck_id')
            expect(response.body).to.have.property('remaining', 54)
            expect(response.body).to.have.property('shuffled', false)
            const deckId = response.body.deck_id;
            return deckId;
         })
        .then((deckId) => {        
            cy.log('Draw Spades from Deck')
            cy.request(deckId+'/draw/?count=13')
            .then((response) => {
                var jsonData = response.body.cards;
                var cardsArray = [];
                var spades = ["AS", "2S", "3S", "4S", "5S", "6S", "7S", "8S", "9S", "0S", "JS", "QS", "KS"]
                var value = ["ACE", "2", "3", "4", "5", "6", "7", "8", "9", "10", "JACK", "QUEEN", "KING"]
                for (var i=0; i<jsonData.length; i++)
                {
                    var code = jsonData[i].code;
                    cardsArray.push(`${code}`);
                    expect(response.body.cards[i].code).to.equal(spades[i])
                    expect(response.body.cards[i].image).to.equal(imageURL+spades[i]+'.png')
                    expect(response.body.cards[i].images.svg).to.equal(imageURL+spades[i]+'.svg')
                    expect(response.body.cards[i].images.png).to.equal(imageURL+spades[i]+'.png')
                    expect(response.body.cards[i].value).to.equal(value[i])
                    expect(response.body.cards[i].suit).to.equal(suitsFull[0])
                }
                expect(response.body).to.have.property('success', true)  
                expect(response.body).to.have.property('deck_id', deckId)  
                expect(response.body).to.have.property('remaining', 41)
                return deckId;
            })
        })
        .then((deckId) => {
            cy.log('Draw Diamonds from Deck')
            cy.request(deckId+'/draw/?count=13')
            .then((response) => {
                var jsonData = response.body.cards;
                var cardsArray = [];
                var diamonds = ["AD", "2D", "3D", "4D", "5D", "6D", "7D", "8D", "9D", "0D", "JD", "QD", "KD"]
                var value = ["ACE", "2", "3", "4", "5", "6", "7", "8", "9", "10", "JACK", "QUEEN", "KING"]              
                for (var i=1; i<jsonData.length; i++)
                {
                    var code = jsonData[i].code;
                    cardsArray.push(`${code}`);
                    expect(response.body.cards[i].code).to.equal(diamonds[i])
                    expect(response.body.cards[i].image).to.equal(imageURL+diamonds[i]+'.png')
                    expect(response.body.cards[i].images.svg).to.equal(imageURL+diamonds[i]+'.svg')
                    expect(response.body.cards[i].images.png).to.equal(imageURL+diamonds[i]+'.png')
                    expect(response.body.cards[i].value).to.equal(value[i])
                    expect(response.body.cards[i].suit).to.equal(suitsFull[1])
                }
                expect(response.body).to.have.property('success', true)  
                expect(response.body).to.have.property('deck_id', deckId)  
                expect(response.body).to.have.property('remaining', 28)
                return deckId;         
            })
        })
        .then((deckId) => {
            cy.log('Create Spades Pile from Drawn Cards')
            cy.request(deckId+'/pile/spades_pile/add/?cards=AS,2S')
            .then((response) => {
                expect(response.body).to.have.property('success', true)
                expect(response.body).to.have.property('deck_id', deckId)  
                expect(response.body).to.have.property('remaining', 28)
                expect(response.body.piles.spades_pile).to.have.property('remaining', 2)
                return deckId;         
            })
        })
        .then((deckId) => {
            cy.log('Return Cards from Spades Pile to Deck')
            cy.request(deckId+'/pile/spades_pile/return/')
            .then((response) => {
                expect(response.body).to.have.property('success', true)
                expect(response.body).to.have.property('deck_id', deckId)  
                expect(response.body).to.have.property('remaining', 30)
                expect(response.body.piles.spades_pile).to.have.property('remaining', 0)
                return deckId;         
            })
        })
        .then((deckId) => {
            cy.log('Create Pile from Drawn Diamonds')
            cy.request(deckId+'/pile/diamonds_pile/add/?cards=AD,2D,3D,4D,5D,6D,7D,8D,9D,0D,JD,QD,KD')
            .then((response) => {
                expect(response.body).to.have.property('success', true)
                expect(response.body).to.have.property('deck_id', deckId)  
                expect(response.body).to.have.property('remaining', 30)
                expect(response.body.piles.spades_pile).to.have.property('remaining', 0)
                expect(response.body.piles.diamonds_pile).to.have.property('remaining', 13)
                return deckId;         
            })
        })   
        .then((deckId) => {
            cy.log('Add Remaining Drawn Cards To Spades Pile')
            cy.request(deckId+'/pile/spades_pile/add/?cards=3S,4S,5S,6S,7S,8S,9S,0S,JS,QS,KS')
            .then((response) => {
                expect(response.body).to.have.property('success', true)
                expect(response.body).to.have.property('deck_id', deckId)  
                expect(response.body).to.have.property('remaining', 30)
                expect(response.body.piles.spades_pile).to.have.property('remaining', 11)
                expect(response.body.piles.diamonds_pile).to.have.property('remaining', 13)
                return deckId;         
            })
        })
        .then((deckId) => {
            cy.log('Shuffle Diamonds Pile')
            cy.request(deckId+'/pile/diamonds_pile/shuffle/')
            .then((response) => {
                expect(response.body).to.have.property('success', true)
                expect(response.body).to.have.property('deck_id', deckId)  
                expect(response.body).to.have.property('remaining', 30)
                expect(response.body.piles.spades_pile).to.have.property('remaining', 11)
                expect(response.body.piles.diamonds_pile).to.have.property('remaining', 13)
                return deckId;         
            })
        })      
        .then((deckId) => {
            cy.log('List cards in Spades Pile')
            cy.request(deckId+'/pile/spades_pile/list/')
            .then((response) => {
                expect(response.body).to.have.property('success', true)
                expect(response.body).to.have.property('deck_id', deckId)  
                expect(response.body).to.have.property('remaining', 30)
                expect(response.body.piles.spades_pile).to.have.property('remaining', 11)
                var jsonData = response.body.piles.spades_pile.cards;
                var cardsArray = [];
                var spades = ["3S", "4S", "5S", "6S", "7S", "8S", "9S", "0S", "JS", "QS", "KS"]
                var value = ["3", "4", "5", "6", "7", "8", "9", "10", "JACK", "QUEEN", "KING"]
                for (var i=0; i<jsonData.length; i++)
                {
                    var code = jsonData[i].code;
                    cardsArray.push(`${code}`);
                    expect(response.body.piles.spades_pile.cards[i].code).to.equal(spades[i])
                    expect(response.body.piles.spades_pile.cards[i].image).to.equal(imageURL+spades[i]+'.png')
                    expect(response.body.piles.spades_pile.cards[i].images.svg).to.equal(imageURL+spades[i]+'.svg')
                    expect(response.body.piles.spades_pile.cards[i].images.png).to.equal(imageURL+spades[i]+'.png')
                    expect(response.body.piles.spades_pile.cards[i].value).to.equal(value[i])
                    expect(response.body.piles.spades_pile.cards[i].suit).to.equal(suitsFull[0])
                }
                expect(response.body.piles.diamonds_pile).to.have.property('remaining', 13)
                return deckId;         
            })
        })
        .then((deckId) => {
            cy.log('List cards in Shuffled Diamonds Pile')
            cy.request(deckId+'/pile/diamonds_pile/list/')
            .then((response) => {
                expect(response.body).to.have.property('success', true)
                expect(response.body).to.have.property('deck_id', deckId)  
                expect(response.body).to.have.property('remaining', 30)
                expect(response.body.piles.spades_pile).to.have.property('remaining', 11)
                var jsonData = response.body.piles.diamonds_pile.cards;
                var cardsArray = [];
                var diamonds = ["AD", "2D", "3D", "4D", "5D", "6D", "7D", "8D", "9D", "0D", "JD", "QD", "KD"]
                var value = ["3", "4", "5", "6", "7", "8", "9", "10", "JACK", "QUEEN", "KING"]
                for (var i=0; i<jsonData.length; i++)
                {
                    var code = jsonData[i].code;
                    cardsArray.push(`${code}`);
                    expect(response.body.piles.diamonds_pile.cards[i].suit).to.equal(suitsFull[1])
                }
                expect(diamonds).to.not.equal(cardsArray)
                expect(response.body.piles.diamonds_pile).to.have.property('remaining', 13)
                return deckId;         
            })
        })
        .then((deckId) => {
            cy.log('Draw 5 Bottom Cards from Spades Pile')
            cy.request(deckId+'/pile/spades_pile/draw/bottom/?count=5')
            .then((response) => {
                expect(response.body).to.have.property('success', true)
                expect(response.body).to.have.property('deck_id', deckId)  
                expect(response.body.piles.spades_pile).to.have.property('remaining', 6)
                var jsonData = response.body.cards;
                var cardsArray = [];
                var spades = ["3S", "4S", "5S", "6S", "7S"]
                var value = ["3", "4", "5", "6", "7"]
                for (var i=0; i<jsonData.length; i++)
                {
                    var code = jsonData[i].code;
                    cardsArray.push(`${code}`);
                    expect(response.body.cards[i].code).to.equal(spades[i])
                    expect(response.body.cards[i].image).to.equal(imageURL+spades[i]+'.png')
                    expect(response.body.cards[i].images.svg).to.equal(imageURL+spades[i]+'.svg')
                    expect(response.body.cards[i].images.png).to.equal(imageURL+spades[i]+'.png')
                    expect(response.body.cards[i].value).to.equal(value[i])
                    expect(response.body.cards[i].suit).to.equal(suitsFull[0])
                }
                expect(response.body.piles.diamonds_pile).to.have.property('remaining', 13)
                return deckId;         
            })
        })
        .then((deckId) => {
            cy.log('Draw Cards Not in Spades Pile')
            const url = deckId+'/pile/spades_pile/draw/?cards=4H,5H,6H'
            cy.request({ url, failOnStatusCode: false })
            .then((response) => {
                expect(response).to.have.property('status', 404)
                expect(response.body).to.have.property('success', false)
                expect(response.body).to.have.property('error', 'The pile, spades_pile does not contain the requested cards.')  
                return deckId;         
            })
        })
        .then((deckId) => {
            cy.log('Draw 5 Top Cards from Spades Pile')
            cy.request(deckId+'/pile/spades_pile/draw/?count=5')
            .then((response) => {
                expect(response.body).to.have.property('success', true)
                expect(response.body).to.have.property('deck_id', deckId)  
                expect(response.body.piles.spades_pile).to.have.property('remaining', 1)
                var jsonData = response.body.cards;
                var cardsArray = [];
                var spades = ["9S", "0S", "JS", "QS", "KS"]
                var value = ["9", "10", "JACK", "QUEEN", "KING"]
                for (var i=0; i<jsonData.length; i++)
                {
                    var code = jsonData[i].code;
                    cardsArray.push(`${code}`);
                    expect(response.body.cards[i].code).to.equal(spades[i])
                    expect(response.body.cards[i].image).to.equal(imageURL+spades[i]+'.png')
                    expect(response.body.cards[i].images.svg).to.equal(imageURL+spades[i]+'.svg')
                    expect(response.body.cards[i].images.png).to.equal(imageURL+spades[i]+'.png')
                    expect(response.body.cards[i].value).to.equal(value[i])
                    expect(response.body.cards[i].suit).to.equal(suitsFull[0])
                }
                expect(response.body.piles.diamonds_pile).to.have.property('remaining', 13)
                return deckId;         
            })
        })
        .then((deckId) => {
            cy.log('OverDraw Cards from Pile')
            var drawAmount = 8 //must be more than 1
            const url = deckId+'/pile/spades_pile/draw/?count='+drawAmount
            cy.request({ url, failOnStatusCode: false })
            .then((response) => {
                expect(response).to.have.property('status', 404)
                expect(response.body).to.have.property('success', false)
                expect(response.body).to.have.property('error', 'Not enough cards remaining to draw '+drawAmount+' additional')  
                return deckId;         
            })
        })
        .then((deckId) => {
            cy.log('Specific Cards from Diamonds Pile')
            cy.request(deckId+'/pile/diamonds_pile/draw/?cards=0D,QD,KD')
            .then((response) => {
                expect(response.body).to.have.property('success', true)
                expect(response.body).to.have.property('deck_id', deckId)  
                expect(response.body.piles.diamonds_pile).to.have.property('remaining', 10)
                var jsonData = response.body.cards;
                var cardsArray = [];
                var diamonds = ["0D", "QD", "KD"]
                var value = ["10", "QUEEN", "KING"]
                for (var i=0; i<jsonData.length; i++)
                {
                    var code = jsonData[i].code;
                    cardsArray.push(`${code}`);
                    expect(response.body.cards[i].code).to.equal(diamonds[i])
                    expect(response.body.cards[i].image).to.equal(imageURL+diamonds[i]+'.png')
                    expect(response.body.cards[i].images.svg).to.equal(imageURL+diamonds[i]+'.svg')
                    expect(response.body.cards[i].images.png).to.equal(imageURL+diamonds[i]+'.png')
                    expect(response.body.cards[i].value).to.equal(value[i])
                    expect(response.body.cards[i].suit).to.equal(suitsFull[1])
                }
                expect(response.body.piles.spades_pile).to.have.property('remaining', 1)
                return deckId;         
            })
        })
        .then((deckId) => {
            cy.log('Draw Random Card from Spades Pile')
            cy.request(deckId+'/pile/spades_pile/draw/random/')
            .then((response) => {
                expect(response.body).to.have.property('success', true)
                expect(response.body).to.have.property('deck_id', deckId)  
                expect(response.body.piles.spades_pile).to.have.property('remaining', 0)
                var jsonData = response.body.cards;
                var cardsArray = [];
                var spades = ["8S"]
                var value = ["8"]
                for (var i=0; i<jsonData.length; i++)
                {
                    var code = jsonData[i].code;
                    cardsArray.push(`${code}`);
                    expect(response.body.cards[i].code).to.equal(spades[i])
                    expect(response.body.cards[i].image).to.equal(imageURL+spades[i]+'.png')
                    expect(response.body.cards[i].images.svg).to.equal(imageURL+spades[i]+'.svg')
                    expect(response.body.cards[i].images.png).to.equal(imageURL+spades[i]+'.png')
                    expect(response.body.cards[i].value).to.equal(value[i])
                    expect(response.body.cards[i].suit).to.equal(suitsFull[0])
                }
                expect(response.body.piles.diamonds_pile).to.have.property('remaining', 10)
                return deckId;         
            })
        })
        .then((deckId) => {
            cy.log('Return specific Cards from Diamonds Pile to Deck')
            const url = deckId+'/pile/diamonds_pile/return/?cards=7D,8D'
            cy.request({ url, failOnStatusCode: false })
            .then((response) => {
                expect(response.body).to.have.property('success', true)
                expect(response.body).to.have.property('deck_id', deckId)
                expect(response.body).to.have.property('remaining', 32)
                expect(response.body.piles.spades_pile).to.have.property('remaining', 0)
                expect(response.body.piles.diamonds_pile).to.have.property('remaining', 8)
                return deckId;         
            })
        })
    })
    it('Create a Deck with No Jokers', () => {
        cy.request('new?jokers_enabled=false')
        .then((response) => {
            expect(response).to.have.property('status', 200)
            expect(response.body).to.have.property('success', true)
            expect(response.body).to.have.property('deck_id')
            expect(response.body).to.have.property('remaining', 52)
            expect(response.body).to.have.property('shuffled', false)
            const deckId = response.body.deck_id;
            return deckId;
         })
    })
    it('Create a new Deck with No Jokers and draw 2 random cards', () => {
        cy.request('new/draw/?count=2')
        .then((response) => {
            expect(response).to.have.property('status', 200)
            expect(response.body).to.have.property('success', true)
            expect(response.body).to.have.property('deck_id')
            expect(response.body).to.have.property('remaining', 50)
            var jsonData = response.body.cards;
            var cardsArray = [];
            for (var i=0; i<jsonData.length; i++)
                {
                    var code = jsonData[i].code;
                    cardsArray.push(`${code}`);
                    expect(response.body.cards[i]).to.have.property('code')
                    expect(response.body.cards[i].code[0]).to.be.oneOf(values)     
                    expect(response.body.cards[i].code[1]).to.be.oneOf(suitsInitial)                   
                    expect(response.body.cards[i]).to.have.property('image')
                    expect(response.body.cards[i].image).to.contains(imageURL)
                    expect(response.body.cards[i].images.svg).to.contains(imageURL)
                    expect(response.body.cards[i].images.png).to.contains(imageURL)
                    expect(response.body.cards[i].suit).to.be.oneOf(suitsFull)
                }                  
            const deckId = response.body.deck_id;
            return deckId;
         })
    })
    it('Various tests with a new shuffled deck', () => {
        cy.log('Create a new Shuffle Deck(1)')
        cy.request('new/shuffle/?deck_count=1')
        .then((response) => {
            expect(response).to.have.property('status', 200)
            expect(response.body).to.have.property('success', true)
            expect(response.body).to.have.property('deck_id')
            expect(response.body).to.have.property('remaining', 52)
            expect(response.body).to.have.property('shuffled', true)
            const deckId = response.body.deck_id;
            return deckId;
         })
         .then((deckId) => {        
            cy.log('Draw 4 cards from shuffled Deck')
            cy.request(deckId+'/draw/?count=4')
            .then((response) => {
                expect(response.body).to.have.property('success', true)  
                expect(response.body).to.have.property('deck_id', deckId)  
                expect(response.body).to.have.property('remaining', 48)
                var jsonData = response.body.cards;
                var cardsArray = [];
                for (var i=0; i<jsonData.length; i++)
                    {
                        var code = jsonData[i].code;
                        cardsArray.push(`${code}`);
                        expect(response.body.cards[i]).to.have.property('code')
                        expect(response.body.cards[i].code[0]).to.be.oneOf(values)     
                        expect(response.body.cards[i].code[1]).to.be.oneOf(suitsInitial)                   
                        expect(response.body.cards[i].image).to.contains(imageURL)
                        expect(response.body.cards[i].images.svg).to.contains(imageURL)
                        expect(response.body.cards[i].images.png).to.contains(imageURL)
                        expect(response.body.cards[i].suit).to.be.oneOf(suitsFull)
                    }
                cardsArray.push(deckId);    
                return cardsArray;
            })
            .then((cardsArray) => {       
                cy.log('return specific cards to deck')
                cy.request((cardsArray[4])+"/return/?cards="
                +(cardsArray[0]+","+cardsArray[1]+","+cardsArray[2]+","+cardsArray[3]))
                .then((response) => {
                        expect(response.body).to.have.property('success', true)  
                    expect(response.body).to.have.property('deck_id', deckId)  
                    expect(response.body).to.have.property('remaining', 52)
                    deckId = cardsArray[4]                            
                    return deckId;
                })
            })
            .then((deckId) => {       
                cy.log('Draw from Shuffled Deck Default')
                cy.request(deckId+"/draw/")
                .then((response) => {
                        expect(response.body).to.have.property('success', true)  
                    expect(response.body).to.have.property('deck_id', deckId)  
                    expect(response.body).to.have.property('remaining', 51)
                    expect(response.body.cards[0].code[0]).to.be.oneOf(values)
                    expect(response.body.cards[0].code[1]).to.be.oneOf(suitsInitial)
                    expect(response.body.cards[0].image).to.contains(imageURL)
                    expect(response.body.cards[0].images.svg).to.contains(imageURL)
                    expect(response.body.cards[0].images.png).to.contains(imageURL)
                    expect(response.body.cards[0].suit).to.be.oneOf(suitsFull)         
                    return deckId;
                })
            })
            .then((deckId) => {       
                cy.log('Reshuffle Remaining Cards')
                cy.request(deckId+"/shuffle/?remaining=true")
                .then((response) => {
                        expect(response.body).to.have.property('success', true)  
                    expect(response.body).to.have.property('deck_id', deckId)  
                    expect(response.body).to.have.property('remaining', 51)
                    expect(response.body).to.have.property('shuffled', true)     
                    return deckId;
                })
            })
            .then((deckId) => {       
                cy.log('Return All Cards to Deck')
                cy.request(deckId+"/return/")
                .then((response) => {
                        expect(response.body).to.have.property('success', true)  
                    expect(response.body).to.have.property('deck_id', deckId)  
                    expect(response.body).to.have.property('remaining', 52)
                    return deckId;
                })
            })
            .then((deckId) => {       
                cy.log('Reshuffle ALL')
                cy.request(deckId+"/shuffle/")
                .then((response) => {
                        expect(response.body).to.have.property('success', true)  
                    expect(response.body).to.have.property('deck_id', deckId)  
                    expect(response.body).to.have.property('remaining', 52)
                    expect(response.body).to.have.property('shuffled', true)
                    return deckId;
                })
            })
        })

    })

  })

