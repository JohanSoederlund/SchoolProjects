using System;
using System.Collections.Generic;
using System.Linq;
namespace App
{
    class Controller
    {
        private List<Shape> listOfShapes = new List<Shape>();
        private static Random random = new Random();
        View view = new View();
        public Controller()
        {
            Run();
        }
        private void Run()
        {
            view.PrintRules();
            Boolean exit = false;
            while (!exit) {
                string userInput = view.GetUserInput();
                switch (userInput)
                {
                    case "0":
                        exit = true;
                        break;
                    case "1":
                        view.PrintRules();
                        break;
                    case "2":
                        view.PrintStatistics(SortListOfShapes(listOfShapes));
                        break;
                    case "Rectangle":
                        listOfShapes.Add(RandomRectangle());
                        break;
                    case "Ellipse":
                        listOfShapes.Add(RandomEllipse());
                        break;
                    case "Cuboid":
                        listOfShapes.Add(RandomCuboid());
                        break;
                    case "Cylinder":
                        listOfShapes.Add(RandomCylinder());
                        break;
                    case "Sphere":
                        listOfShapes.Add(RandomSphere());
                        break;
                    default:
                        Console.WriteLine("Not a shape");
                        break;
                }
            }
            
        }
        
        private Rectangle RandomRectangle()
        {
            return new Rectangle(GetRandomNumber(1, 100), GetRandomNumber(1, 100));
        }
        private Ellipse RandomEllipse()
        {
            return new Ellipse(GetRandomNumber(1, 100), GetRandomNumber(1, 100));
        }
        private Cuboid RandomCylinder()
        {
            return new Cuboid(GetRandomNumber(1, 100), GetRandomNumber(1, 100), GetRandomNumber(1, 100));
        }
        private Cylinder RandomSphere()
        {
            return new Cylinder(GetRandomNumber(1, 100), GetRandomNumber(1, 100), GetRandomNumber(1, 100));
        }
        private Sphere RandomCuboid()
        {
            return new Sphere(GetRandomNumber(1, 100));
        }
        private List<List<Shape>> SortListOfShapes(List<Shape> listToSort)
        {   
            List<List<Shape>> sortedList = new List<List<Shape>>();
            sortedList.Add(new List<Shape>());
            sortedList.Add(new List<Shape>());
            sortedList.Add(new List<Shape>());
            sortedList.Add(new List<Shape>());
            sortedList.Add(new List<Shape>());
            if (listToSort == null || listToSort.Count == 0) 
            {
                return sortedList;
            }
            List<Ellipse> ellipseList = new List<Ellipse>();
            List<Cylinder> cylList = new List<Cylinder>();
            List<Rectangle> recList = new List<Rectangle>();
            List<Cuboid> cubList = new List<Cuboid>();
            List<Sphere> sphereList = new List<Sphere>();
            foreach (var item in listToSort)
            {
                switch (item.ShapeType)
                {
                    case ShapeType.Ellipse:
                        ellipseList.Add((Ellipse)item);
                        break;
                    case ShapeType.Rectangle:
                        recList.Add((Rectangle)item);
                        break;
                    case ShapeType.Cylinder:
                        cylList.Add((Cylinder)item);
                        break;
                    case ShapeType.Cuboid:
                        cubList.Add((Cuboid)item);
                        break;
                    case ShapeType.Sphere:
                        sphereList.Add((Sphere)item);
                        break;
                    default:
                        Console.WriteLine("Not a shape");
                        break;
                }
            }
            if (ellipseList.Count != 0) 
            {
                ellipseList.Sort( (x,y)=>x.Area.CompareTo(y.Area) );
                sortedList[0].AddRange(ellipseList);
            }
            if (recList.Count != 0) 
            {
                recList.Sort( (x,y)=>x.Area.CompareTo(y.Area) );
                sortedList[1].AddRange(recList);
            }
            if (cylList.Count != 0) 
            {
                cylList.Sort( (x,y)=>x.Volume().CompareTo(y.Volume()) );
                sortedList[2].AddRange(cylList);
            }
            if (cubList.Count != 0) 
            {
                cubList.Sort( (x,y)=>x.Volume().CompareTo(y.Volume()) );
                sortedList[3].AddRange(cubList);
            }
            if (sphereList.Count != 0) 
            {
                sphereList.Sort( (x,y)=>x.Volume().CompareTo(y.Volume()) );
                sortedList[4].AddRange(sphereList);
            }
            return sortedList;
        }

        public double GetRandomNumber(double minimum, double maximum)
        { 
            return random.NextDouble() * (maximum - minimum) + minimum;
        }
    }
}

