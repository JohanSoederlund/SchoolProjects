using System;
using System.Collections.Generic;
using System.Text;
using System.Linq;

namespace Game21
{
    /// <summary>
    /// Class describing a player
    /// </summary>
    public class Player : TableMember
    {
        public Player(string name) : base(name)
        {
        }
        private readonly List<Card> hand = new List<Card>();
        /// <summary>
        /// Returns the list of cards in playerhand
        /// </summary>
        public List<Card> Hand
        {
            get
            {
                List<Card> copy = new List<Card>();
                foreach (Card card in hand)
                {
                    copy.Add(new Card(card.Suit, card.Face));
                }
                return copy;
            }
        }
        /// <summary>
        /// Takes the given card and adds it to the hand
        /// </summary>
        /// <param name="card">An instance of a Card object</param>
        public override void TakeCard(Card card)
        {
            if (card == null)
            {
                throw new ArgumentNullException("card");
            }
            hand.Add(card);
        }
        /// <summary>
        /// Returns this object as a string representation
        /// </summary>
        /// <returns></returns>
        public override string ToString()
        {
            /*
            string handStr = "";
            foreach (Card card in hand)
            {
                handStr += card.ToString() + " ";
            }*/
            return $"{Name}: {string.Join(" ", hand)} ({Rules.CalculateValue(hand)})";
        }
    }
}
