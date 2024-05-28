# NW Ping pong ranking: The golden racket

## Methodology

This API provides a calculation of a score for each player based on the ELO model. Just as in chess when two players A and B face each other in a match, their score will be updated updated following the ELO model. 
In order to compute the calculations I followed this [article](https://mattmazzola.medium.com/implementing-the-elo-rating-system-a085f178e065)

In addition, matches in "Best of" 1, 3 or 5 do not account for the same. It is more prestigious to win a BO5 game, hence the ELO score update will be updated with a "prestige scale factor" `K` (i.e the update of your score will be `K * updatedScore`)
- BO1: Factor 1
- BO3: Factor 3
- BO5: Factor 5

Moreover, no matter how big or small is your win (or loose), your new score will be the same.

## Use

### Players

### Games