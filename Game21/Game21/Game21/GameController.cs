using System;
using System.Collections.Generic;
using System.Text;

namespace Game21
{
    /// <summary>
    /// Controller class, controls the flow of the game
    /// </summary>
    class GameController
    {

        private Deck deck = new Deck();
        private List<Player> players = new List<Player>();
        private Dealer dealer = new Dealer("Dealer");
        public GameController()
        {
            Run();
        }
        /// <summary>
        /// Instantiates the table and starts rounds
        /// </summary>
        private void Run()
        {
            deck.ShuffleDeck();
            View.PrintGameInfromation();
            int nmbrOfPlayers = 0;
            if (Int32.TryParse(View.NmbrOfPlayers(), out nmbrOfPlayers))
            {
                for (int i = 0; i < nmbrOfPlayers; i++)
                {
                    players.Add(new Player(View.NewPlayer()));
                }
            } else
            {
                players.Add(new Player(View.NewPlayer()));
            }
            PlayerRounds();
            DealerRounds();
            Console.WriteLine("END");
        }
        /// <summary>
        /// Dealer draw cards and plays against every player,
        /// Uses Rules to check who is winning and calls for printing methods in View
        /// </summary>
        private void DealerRounds()
        {
            foreach (Player player in players)
            {
                if (Rules.IsBusted(player.Hand) == false || Rules.IsWinner(player.Hand) == false)
                {
                    dealer.AddHand();
                    DeckSize();
                    dealer.TakeCard(deck.DrawCard());
                    View.PrintHand(player.ToString());
                    View.PrintHand(dealer.ToString("L"));
                    if (Rules.CalculateValue(player.Hand) > Rules.CalculateValue(dealer.GetLastHand()))
                    {
                        System.Threading.Thread.Sleep(2000);
                        DeckSize();
                        dealer.TakeCard(deck.DrawCard());
                        View.PrintHand(dealer.ToString("L"));
                        if (Rules.IsBusted(dealer.GetLastHand()))
                        {
                            View.PrintBusted(dealer.Name);
                            View.PrintWinner();
                        }
                        else if (Rules.CalculateValue(dealer.GetLastHand()) >= Rules.CalculateValue(player.Hand))
                        {
                            View.PrintLooser(player.Name);
                        }
                        else
                        {
                            View.PrintWinner();
                        }
                    }
                    else
                    {
                        View.PrintLooser(player.Name);
                    }
                }
                else
                {
                    View.PrintHand(player.ToString());
                    View.PrintBusted(player.Name);
                    View.PrintLooser(player.Name);
                }
            }
        }
        /// <summary>
        /// Each player draw cards untill satisfyed,
        /// then controlling points against Rules class
        /// </summary>
        private void PlayerRounds()
        {
            foreach (Player player in players)
            {
                player.TakeCard(deck.DrawCard());
                View.PrintHand(player.ToString());
            }
            foreach (Player player in players)
            {
                while (View.HitMe(player.Name).CompareTo("y") == 0)
                {
                    DeckSize();
                    player.TakeCard(deck.DrawCard());
                    View.PrintHand(player.ToString());
                    if (Rules.IsBusted(player.Hand))
                    {
                        View.PrintBusted(player.Name);
                        break;
                    }
                    else if (Rules.IsWinner(player.Hand))
                    {
                        View.PrintWinner();
                        break;
                    }

                }
            }
        }
        /// <summary>
        /// Refills and shuffles deck if needed
        /// </summary>
        private void DeckSize()
        {
            if (deck.Size() <= 1)
            {
                deck.RefillDeck();
                deck.ShuffleDeck();
            }
        }

        
    }
}
