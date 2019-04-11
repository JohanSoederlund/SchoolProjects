using System;
using System.Collections.Generic;
using System.Text;

namespace Game21
{
    /// <summary>
    /// Abstract base class for Player and Dealer
    /// </summary>
    public abstract class TableMember
    {
        public string Name { get; private set; }
        /// <summary>
        /// Sets the name of the Player or Dealer
        /// </summary>
        /// <param name="name"></param>
        public TableMember (string name)
        {
            Name = name;
        }
        public abstract void TakeCard(Card card);
        
        public abstract override string ToString();


    }
}
