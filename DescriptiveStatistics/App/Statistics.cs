/*
 * <author> Johan Söderlund</author>
 * <version> 1.0</version>
 */

using System;
using System.Collections.Generic;
using System.Linq;

namespace App
{
    public static class Statistics
    {
        /*
         * <summary>Sorts the array by descending order</summary>
         * <param name="source"> int[] to be treated</param>
         */
        public static int[] SortArray(int[] source){
            if (source == null){
                throw new System.ArgumentNullException("source", "Parameter cannot be null");
            } else if (source.Length == 0){
                throw new System.InvalidOperationException("Sequence contains no elements");
            } else {
                return source.OrderBy(i => i).ToArray();
            }
        }
        /*
         * <summary>Return an anonymous object with descriptive statistics</summary>
         * <param name="source"> int[] to be treated</param>
         */
        public static dynamic DescriptiveStatistics(int[] source){
            if (source == null){
                throw new System.ArgumentNullException("source", "Parameter cannot be null");
            } else if (source.Length == 0){
                throw new System.InvalidOperationException("Sequence contains no elements");
            } else {
                int[] sortedArray = SortArray(source);
                int max = Maximum(sortedArray); 
                int min = Minimum(sortedArray);
                double mean = Mean(sortedArray); 
                double median = Median(sortedArray); 
                int[] mode = Mode(sortedArray);
                string modeAsString = "{ ";
                foreach(int element in mode){
                    modeAsString += element.ToString() + " ";
                }
                modeAsString += "}";
                int range = Range(sortedArray);
                double deviation = StandardDeviation(sortedArray); 

                string asda = mean.ToString("0.0");
                string sadasdas = median.ToString("0.0");
                string asdda = deviation.ToString("0.0");
                string asgda = 55.55555.ToString("0.0");

                //create anonymous object with result
                var anonStats = new {
                    Maximum = "           : " + max + "\n",
                    Minimum = "           : " + min + "\n",
                    Medelvärde = "        : " + string.Format("{0:0.0}",Math.Truncate(mean*10)/10) + "\n",
                    Median = "            : " + string.Format("{0:0.0}",Math.Truncate(median*10)/10) + "\n",
                    Typvärde = "          : " + modeAsString + "\n",
                    Variationsbredd = "   : " + range + "\n",
                    Standardavvikelse = " : " + string.Format("{0:0.0}",Math.Truncate(deviation*10)/10)
                };
                return anonStats;
            }
        }
        /*
         * <summary>Gets the maximum value</summary>
         * <param name="source"> int[] to be treated</param>
         */
        public static int Maximum(int[] source){
            if (source == null){
                throw new System.ArgumentNullException("source", "Parameter cannot be null");
            } else if (source.Length == 0){
                throw new System.InvalidOperationException("Sequence contains no elements");
            } else {
                return source.Last();
            }
        }
        /*
         * <summary>Gets the mean value</summary>
         * <param name="source"> int[] to be treated</param>
         */
        public static double Mean(int[] source){
            if (source == null){
                throw new System.ArgumentNullException("source", "Parameter cannot be null");
            } else if (source.Length == 0){
                throw new System.InvalidOperationException("Sequence contains no elements");
            } else {
                int sum = 0;
                foreach (int element in source) {
                    sum += element;
                }
                double mean = (double)sum/source.Length;
                return mean;
            }
        }
        /*
         * <summary>Gets the median value</summary>
         * <param name="source"> int[] to be treated</param>
         */
        public static double Median(int[] source){
            if (source == null){
                throw new System.ArgumentNullException("source", "Parameter cannot be null");
            } else if (source.Length == 0){
                throw new System.InvalidOperationException("Sequence contains no elements");
            } else {
                double median;
                if (source.Length % 2 != 1) {
                    double value1 = (double)source[source.Length/2];
                    double value2 = (double)source[(source.Length/2)-1];
                    median = (value1 + value2) / 2;
                    return median;
                }else {
                    int index = (source.Length-1)/2;
                    median = (double)source[index];
                    return median;
                }
            }
        }
        /*
         * <summary>Gets the minimum value</summary>
         * <param name="source"> int[] to be treated</param>
         */
        public static int Minimum(int[] source){
            if (source == null){
                throw new System.ArgumentNullException("source", "Parameter cannot be null");
            } else if (source.Length == 0){
                throw new System.InvalidOperationException("Sequence contains no elements");
            } else {
                return source[0];
            }
        }

        /*
         * <summary>Get the mode value(s)</summary>
         * <param name="source"> int[] to be treated</param>
         */
        public static int[] Mode(int[] source){
            if (source == null){
                throw new System.ArgumentNullException("source", "Parameter cannot be null");
            } else if (source.Length == 0){
                throw new System.InvalidOperationException("Sequence contains no elements");
            } else {
                List<int> tempMode = new List<int>();
                int[] src = SortArray(source);
                
                if (src.Length > 1){
                    int tmpInt = src[0];
                    int nmbrOfRepetitions = 0;
                    int maxRepetitions = 0;
                    for(int i = 1; i < src.Length; i++) {
                        if(tmpInt == src[i]) {
                            nmbrOfRepetitions++;
                        } else if (maxRepetitions < nmbrOfRepetitions) {
                            maxRepetitions = nmbrOfRepetitions;
                            nmbrOfRepetitions = 0;
                            tempMode.Clear();
                            tempMode.Add(tmpInt);
                            tmpInt = src[i];
                        } else if (maxRepetitions == nmbrOfRepetitions) {
                            nmbrOfRepetitions = 0;
                            tempMode.Add(tmpInt);
                            tmpInt = src[i];
                        } else {
                            nmbrOfRepetitions = 0;
                            tmpInt = src[i];
                        }
                    }
                    if (maxRepetitions < nmbrOfRepetitions) {
                        tempMode.Clear();
                        tempMode.Add(tmpInt);
                    } else if (maxRepetitions == nmbrOfRepetitions) {
                        tempMode.Add(tmpInt);
                    }
                    int[] mode = tempMode.ToArray();
                    return mode;
                }
                return src;
            }
        }
        /*
         * <summary>Get the range</summary>
         * <param name="source"> int[] to be treated</param>
         */
        public static int Range(int[] source){
            if (source == null){
                throw new System.ArgumentNullException("source", "Parameter cannot be null");
            } else if (source.Length == 0){
                throw new System.InvalidOperationException("Sequence contains no elements");
            } else {
                int range = source.Last() - source[0];
                return range;
            }
        }
        /*
         * <summary>Get the standard deviation</summary>
         * <param name="source"> int[] to be treated</param>
         */
        public static double StandardDeviation(int[] source){
            if (source == null){
                throw new System.ArgumentNullException("source", "Parameter cannot be null");
            } else if (source.Length == 0){
                throw new System.InvalidOperationException("Sequence contains no elements");
            } else {
                double mean = Mean(source);
                double deviation = 0;
                foreach(int element in source){
                    deviation += (element - mean)*(element - mean);
                }
                deviation /= source.Length;
                deviation = Math.Sqrt(deviation);
                return deviation;
            }
        }
    }
}
