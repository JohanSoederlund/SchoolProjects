using System;

namespace Game21
{
    /// <summary>
    /// Descriptive class of a Card
    /// </summary>
    public class Card
    {
        /// <summary>
        /// ctor for Card
        /// </summary>
        /// <param name="suit">The card's suit</param>
        /// <param name="face">The card's value</param>
        public Card(ISuit suit, IFace face)
        {
            Suit = suit;
            Face = face;
        }
        public readonly ISuit Suit;
        public readonly IFace Face;
        /// <summary>
        /// String representation of this Card
        /// </summary>
        /// <returns>The Face and the Suit</returns>
        public override string ToString()
        {
            return $"{Face} of {Suit}";
        }
    }
}