using System.Windows;
using System;

namespace App
{
    public class Ellipse : Shape2D
    {
        public Ellipse(double diameter) : base((ShapeType)1, diameter, diameter){

        }
        public Ellipse(double hdiameter, double wdiameter) : base((ShapeType)1, hdiameter, wdiameter){
            
        }
        public override double Area { 
            get {
                return Math.PI * this.Length()/2d * this.Width()/2d;
            }
        }
        public override double Perimeter { 
            get {
                return Math.PI * Math.Sqrt( Math.Pow(this.Length()/2d, 2d)*2 + Math.Pow(this.Width()/2d, 2d)*2 ) ;
            }
        }
    }
}