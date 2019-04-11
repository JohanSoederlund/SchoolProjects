using System;
using System.Collections.Generic;

namespace Game21
{
    /// <summary>
    /// Card Game21, console application.
    /// </summary>
    /// <author>
    /// Johan Söderlund
    /// </author> 
    class Program
    {
        /// <summary>
        /// Start point of application.
        /// </summary>
        /// <param name="args"></param>
        static void Main(string[] args)
        {
            try
            {
                GameController gameController = new GameController();
            } catch (Exception ex)
            {
                Console.WriteLine("Catching exception:\n\n", ex);
            }
        }

    }
    
}