using System;
using System.Collections.Generic;
using System.Text;
using System.Linq;

namespace Game21
{
    /// <summary>
    /// Descriptive class of a deck of cards
    /// </summary>
    class Deck
    {
        private readonly List<Card> deck = new List<Card>();
        private readonly List<Card> binDeck = new List<Card>();
        private readonly Random randomSeed = new Random();
        /// <summary>
        /// Ctor insatciates the Deck
        /// </summary>
        public Deck()
        {
            foreach (ISuit suit in Enum.GetValues(typeof(ISuit)))
            {
                foreach (IFace face in Enum.GetValues(typeof(IFace)))
                {
                    deck.Add(new Card(suit, face));
                }
            }
        }
        /// <summary>
        /// Shuffles the deck using Fisher-Yates algorithm
        /// </summary>
        public void ShuffleDeck()
        {
            if (deck == null || !deck.Any())
            {
                throw new ArgumentNullException("deck");
            }
            //Fisher-Yates shuffle
            for (int i = deck.Count - 1; i >= 0; i--)
            {
                int swapIndex = randomSeed.Next(i + 1);
                Card tmp = deck[i];
                deck[i] = deck[swapIndex];
                deck[swapIndex] = tmp;
            }
        }
        /// <summary>
        /// Determines the number of cards left in the Deck
        /// </summary>
        /// <returns>numberOfCards as int</returns>
        public int Size()
        {
            if (deck == null)
            {
                throw new ArgumentNullException("deck");
            } else if (!deck.Any())
            {
                return 0;
            }
            return deck.Count;
        }
        /// <summary>
        /// Takes a card from the top of the deck
        /// </summary>
        /// <returns>Card</returns>
        public Card DrawCard()
        {
            if (deck == null || !deck.Any())
            {
                throw new ArgumentNullException("deck");
            }
            binDeck.Add(new Card(deck.LastOrDefault().Suit, deck.LastOrDefault().Face));
            Card card = new Card(deck.LastOrDefault().Suit, deck.LastOrDefault().Face);
            deck.RemoveAt(deck.Count - 1);
            return card;
        }
        /// <summary>
        /// Refills the Deck with cards from the binDeck
        /// </summary>
        public void RefillDeck()
        {
            if (binDeck == null)
            {
                throw new ArgumentNullException("deck");
            }
            else if (!binDeck.Any())
            {
                return;
            }
            foreach (Card card in binDeck)
            {
                deck.Add(card);
            }
            binDeck.Clear();
        }
        /// <summary>
        /// String representation of this object
        /// </summary>
        /// <returns>This Deck as a well formated string</returns>
        public override string ToString()
        {
            if (deck == null)
            {
                throw new ArgumentNullException("deck");
            } else if (!deck.Any())
            {
                return "Empty deck";
            }
            string str = "";
            foreach (Card card in deck)
            {
                str += deck[0].ToString() + ", ";
            }
            return str;
        }
    }
}
