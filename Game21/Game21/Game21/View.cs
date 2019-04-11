using System;
using System.Collections.Generic;
using System.Text;

namespace Game21
{
    /// <summary>
    /// Simple view class for game output
    /// </summary>
    public static class View
    {

        public static void PrintGameInfromation()
        {
            Console.WriteLine("Welcome to Game21,\n" +
                "the goal of this game is to get to 21 points or beat the dealer by getting a better hand.\n" +
                "Ace is worth 1 or 14 points, king=13, queen=12 and jack=11.\n" +
                "Every round you will deside if you want another card or stop,\n" +
                "if you deside to stop the dealer will then draw one or two cards and then compare hands.\n" +
                "Good luck!\n");
        }
        /// <summary>
        /// asks for name input
        /// </summary>
        /// <returns>playername as a string</returns>
        public static string NewPlayer()
        {
            Console.WriteLine("Player name: ");
            return Console.ReadLine();
        }
        /// <summary>
        /// Console output for a hand of cards
        /// </summary>
        /// <param name="hand">list of cards</param>
        public static void PrintHand(string hand)
        {
            if (string.IsNullOrEmpty(hand))
            {
                throw new ArgumentException(hand);
            }
            Console.WriteLine(hand);
        }
        /// <summary>
        /// Prints winner
        /// </summary>
        public static void PrintWinner()
        {
            Console.WriteLine("Winner, winner chicken dinner!\n");
        }
        /// <summary>
        /// Console output for a busted player or dealer
        /// </summary>
        /// <param name="name">Name as a string</param>
        public static void PrintBusted(string name)
        {
            if (string.IsNullOrEmpty(name))
            {
                throw new ArgumentException(name);
            }
            Console.WriteLine(name + " is busted.");
        }
        /// <summary>
        /// Console output for a loosing player
        /// </summary>
        /// <param name="name">name as string</param>
        public static void PrintLooser(string name)
        {
            if (string.IsNullOrEmpty(name))
            {
                throw new ArgumentException(name);
            }
            Console.WriteLine(name + " lost.\n");
        }
        /// <summary>
        /// Asks for player input if he/she wants another card
        /// </summary>
        /// <param name="name">name as a string</param>
        /// <returns></returns>
        public static string HitMe(string name)
        {
            if (string.IsNullOrEmpty(name))
            {
                throw new ArgumentException(name);
            }
            Console.WriteLine(name + " do you want another card?(y/n)");
            return Console.ReadLine();
        }
        /// <summary>
        /// Asks for player input, number of players at the table
        /// </summary>
        /// <returns></returns>
        public static string NmbrOfPlayers()
        {
            Console.WriteLine("How many players at the table?");
            return Console.ReadLine();
        }
    }
}
