using System.Windows;
using System;

namespace App
{
    public abstract class Shape2D : Shape
    {
        private double _length;
        private double _width;
        
        protected Shape2D(ShapeType ShapeType, double length, double width) : base(ShapeType) {
            Length(length);
            Width(width);
        }

        public abstract double Area {get;}

        public double Length() {
            return this._length;
        }
        private void Length(double length){
            if (length <= 0) {
                throw new System.ArgumentOutOfRangeException("length", "Length must be greater than 0!");
            }
            this._length = length;
        }

        public abstract double Perimeter {get;}

        public double Width() {
            return this._width;
        }
        private void Width(double width){
            if (width <= 0) {
                throw new System.ArgumentOutOfRangeException("width", "Width must be greater than 0!");
            }
            this._width = width;
        }

        public string ToString(string format){
            if (format.CompareTo("G") == 0 || string.IsNullOrEmpty(format))
            {
                return $"Längd : {Length()}\nBredd : {Width()}\nOmkrets : {Perimeter}\nArea : {Area}";
            } else if(format.CompareTo("R") == 0 ) 
            {
                return $"{this.ShapeType}  \t {Length().ToString("#.#")} \t {Width().ToString("#.#")} \t {Perimeter.ToString("#.#")} \t\t {Area.ToString("#.#")}";
            } else 
            {
                throw new System.FormatException("Format is neither empty, G, null nor R.");
            }
        }

        public override string ToString(){
            return $"Längd : {Length()}\nBredd : {Width()}\nOmkrets : {Perimeter}\nArea : {Area}";
        }
    }
}
