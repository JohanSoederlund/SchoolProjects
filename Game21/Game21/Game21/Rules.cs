using System;
using System.Collections.Generic;
using System.Text;
using System.Linq;

namespace Game21
{
    /// <summary>
    /// Model class for the rules of the game, (logics)
    /// </summary>
    public static class Rules
    {
        /// <summary>
        /// Calculates the total value of a hand
        /// </summary>
        /// <param name="hand">list of cards</param>
        /// <returns></returns>
        public static int CalculateValue (List<Card> hand)
        {
            if (hand == null || !hand.Any())
            {
                throw new ArgumentNullException("hand");
            }
            int value = 0;
            int nmbrOfAces = 0;
            foreach (Card card in hand)
            {
                if (card.Face == IFace.Ace)
                {
                    nmbrOfAces++;
                } 
                value += (int)card.Face;
            }
            while (value > 21 && nmbrOfAces > 0)
            {
                value -= 13;
                nmbrOfAces--;
            }
            return value;
        }
        /// <summary>
        /// Determines if a player or dealer is busted
        /// </summary>
        /// <param name="hand">list of cards</param>
        /// <returns></returns>
        public static bool IsBusted(List<Card> hand)
        {
            if (hand == null || !hand.Any())
            {
                throw new ArgumentNullException("hand");
            }
            if (CalculateValue(hand) > 21)
            {
                return true;
            }
            return false;
        }
        /// <summary>
        /// Determines if a player or dealer is winner by 21
        /// </summary>
        /// <param name="hand">list of cards</param>
        /// <returns></returns>
        public static bool IsWinner(List<Card> hand)
        {
            if (hand == null || !hand.Any())
            {
                throw new ArgumentNullException("hand");
            }
            if (CalculateValue(hand) == 21)
            {
                return true;
            }
            return false;
        }
    }
}
