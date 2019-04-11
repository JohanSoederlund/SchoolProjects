using System.Windows;
using System;

namespace App
{
    public class Rectangle : Shape2D
    {
        
        public Rectangle(double length, double width) : base((ShapeType)0, length, width){
            
        }
        public override double Area { 
            get {
                return this.Length() * this.Width();
            }
        }
        public override double Perimeter { 
            get {
                return (2 * this.Length()) + (2 * this.Width());
            }
        }
    }
}