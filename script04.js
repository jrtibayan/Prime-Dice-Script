/*
 * Bot Behavior
 *     set to x1.1 Over
 *     wait for 1 loss when hit is < 9.9
 *     after that hit wait for 24 wins
 *     if there is loss, reset count till you count 24 wins
 *     on the 25th roll bet real bet
 *     if you win dummy bet till loss is found then wait again
 *     if lost you lost wait again
 * Reason for this behavior
 *     Since there will have a few hits below <9.9 that will result to a loss,
 *         Bet only on 25th roll even if you lose,
 *             on the long run the amount lost will be less than the amount won eventually
 *             r25: 30
 *             r26: 30
 *             r27: 30
 *             r28: 25
 *             ....
 *             ....
 *             r100: 10
 *         The hits on roll 26th to 100+ is virtually my win
 *         on 3076 rounds there was 2721 hits on the first 21 rolls
 * Status
 *     Will start this another day
 *
 */