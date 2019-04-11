using System;
using System.Collections.Generic;
using System.Text;

namespace Game21
{
    /// <summary>
    /// Class describing a Dealer
    /// </summary>
    public class Dealer : TableMember
    {

        public Dealer (string name) : base(name)
        {
        }
        private readonly List<List<Card>> hands = new List<List<Card>>();
        /// <summary>
        /// Adds a hand to the dealer, to play against a playerhand
        /// </summary>
        public void AddHand()
        {
            hands.Add(new List<Card>());
        }
        /// <summary>
        /// Gets the dealers list of hand 
        /// </summary>
        public List<List<Card>> Hands
        {
            get
            {
                if (hands == null)
                {
                    throw new ArgumentNullException("hands");
                }
                List<List<Card>> copy = new List<List<Card>>();
                foreach (List<Card> hand in hands)
                {
                    copy.Add(new List<Card>());
                    foreach (Card card in hands[hands.Count - 1])
                    {
                        copy[copy.Count - 1].Add(new Card(card.Suit, card.Face));
                    }
                }
                return copy;
            }
        }
        /// <summary>
        /// Returns a copy of the last hand of the dealers hands
        /// </summary>
        /// <returns>copy of hand</returns>
        public List<Card> GetLastHand ()
        {
            List<Card> copy = new List<Card>();
            if (hands == null || hands[hands.Count - 1] == null)
            {
                throw new ArgumentNullException("hands");
            }
            foreach (Card card in hands[hands.Count - 1])
            {
                copy.Add(new Card(card.Suit, card.Face));
            }
            return copy;
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
            hands[hands.Count - 1].Add(card);
        }

        public override string ToString()
        {
            return ToString("G");
        }
        /// <summary>
        /// Returns a string representation of the object
        /// </summary>
        /// <param name="format">string, g whole object, L last hand</param>
        /// <returns></returns>
        public string ToString(string format)
        {
            string handStr = "";
            if (format.CompareTo("G") == 0 || string.IsNullOrEmpty(format))
            {
                foreach (List<Card> hand in hands)
                {
                    int index = 0;
                    handStr += " Hand number " + (1+index) + ": ";
                    foreach (Card card in hands[index])
                    {
                        handStr += card.ToString() + " ";
                    }
                }
                return $"{Name}: {handStr}";
            }
            else if (format.CompareTo("L") == 0)
            {
                foreach (Card card in hands[hands.Count - 1])
                {
                    handStr += card.ToString() + " ";
                }
                return $"{Name}: {handStr} ({Rules.CalculateValue(hands[hands.Count - 1])})";
            }
            else
            {
                throw new System.FormatException("Format is neither G or L.");
            }
        }
    }
}
