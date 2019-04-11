using System.Windows;
using System;

namespace App
{
    public abstract class Shape3D : Shape
    {
        protected Shape2D _baseShape;
        private double _height; 
        
        protected Shape3D(ShapeType shapeType, Shape2D baseShape, double height) : base(shapeType) {
            Height(height);
            _baseShape = baseShape;
        }
        public double Height() {
            return this._height;
        }

        private void Height(double height){
            if (height <= 0) {
                throw new System.ArgumentOutOfRangeException("height", "Height must be greater than 0!");
            }
            this._height = height;
        }
        public virtual double MantelArea() {
            return _baseShape.Perimeter * _height; 
        }
        public virtual double TotalSurfaceArea() {
            return MantelArea() + (2d * _baseShape.Area);
        }
        public virtual double Volume() {
            return _baseShape.Area * _height;
        }
        
        public string ToString(string format){
            if (format.CompareTo("G") == 0 || string.IsNullOrEmpty(format))
            {
                return $"Längd : {_baseShape.Length()}\nBredd : {_baseShape.Width()}\nHöjd  : {Height()}\nMantelarea : {MantelArea()}\nBegränsningsarea : {TotalSurfaceArea()}\nVolym : {Volume()}";
            } else if(format.CompareTo("R") == 0 ) 
            {
                return $"{this.ShapeType}  \t {_baseShape.Length().ToString("#.#")} \t {_baseShape.Width().ToString("#.#")} \t {Height().ToString("#.#")} \t {MantelArea().ToString("#.#")} \t\t {TotalSurfaceArea().ToString("#.#")} \t {Volume().ToString("#.#")}";
            } else 
            {
                throw new System.FormatException("Format is neither empty, G, null nor R.");
            }
        }

        public override string ToString(){
            return $"Längd : {_baseShape.Length()}\nBredd : {_baseShape.Width()}\nHöjd  : {Height()}\nMantelarea : {MantelArea()}\nBegränsningsarea : {TotalSurfaceArea()}\nVolym : {Volume()}";
        }
    }
}
