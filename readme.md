# Lottery Game

Consider a lottery game where there are 59 balls numbered from 1 to 59. Please complete the challenge using JavaScript or TypeScript.

## Rules 

The player selects 6 individual numbers from the range 1-59.
6 Balls are then drawn randomly from the 59 balls available.
Prizes are awarded for matching 3, 4, 5 and 6 Ball numbers.
- 3 = 50
- 4 = 100
- 5 = 200
- 6 = 500

## Task

Create and provide a playable visual version of the lottery game which highlights wins and lets the user have the following selection option
    - Manual pick - The user should be able to pick 6 numbers. 
    - Lucky Dip Button - to select 6 random numbers to match.
    - Start Game Button - to instruct 6 random balls to be drawn. 
    - Reset the game

Once the numbers have been drawn they should be matched to the picked (or lucky dip) numbers. Prizes should be awarded according to the pay-table above. 

----------

## Notes

I wasn't sure what you wanted to see here, so possibly I went a little overboard. Some notes on the task:

- I use plain JS, since that's just what I'm most familiar with
- No server side, just click the html
- Nevertheless, if there were a server and getresults() were to return a fetch request instead it would work just fine. If you wanted to see a server for this test I would put it here
- Added some basic canvas animations. I figured this would be relevant, although they are basic (i'm no great artist!)
- Added stats and a cheat mode. You can use this if you want to see some wins coming through
- I underestimated the time for building the UI - I forgot how long animations and things take to do!
- Total time spent: 4-5h