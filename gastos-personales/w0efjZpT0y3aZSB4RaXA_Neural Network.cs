var nn = new SimpleAdderNN();
nn.Train();


double result1 = nn.Predict(50, 10);
Console.WriteLine($"La suma aproximada es: {result1}");

double result2 = nn.Predict(55, 20);
Console.WriteLine($"La suma aproximada es: {result2}");

class SimpleAdderNN
{
    private double weight1; 
    private double weight2; 
    private double bias;

    private readonly (double x1, double x2, double sum)[] trainingData = 
    [
        (0, 0, 0), // 0 + 0 = 0.
        (0, 1, 1), // 0 + 1 = 1.
        (1, 0, 1), // 1 + 0 = 1.
        (1, 1, 2), // 1 + 1 = 2.
        (2, 3, 5), // 2 + 3 = 5.
        (4, 5, 9) // 4 + 5 = 9.
    ];

    public SimpleAdderNN() 
    {
        weight1 = 0.0; 
        weight2 = 0.0; 
        bias = 0.0; 
    }

    public void Train()
    {
        const double learningRate = 0.1;
        
        for (int epoch = 0; epoch < 500; epoch++)
        {
            foreach (var (x1, x2, sum) in trainingData)
            {
                double prediction = Predict(x1, x2);
                double error = sum - prediction;

                weight1 += learningRate * error * x1;
                weight2 += learningRate * error * x2;
                bias += learningRate * error;
            }
        }
    }

    public double Predict(double x1, double x2) 
    {
        return x1 * weight1 + x2 * weight2 + bias;
    }

}