using System;
using System.Collections.Generic;

class MyProgram
{
    private List<string> Beers { get; } = new();
    private ISave SaveImplementation { get; }

    public MyProgram(ISave saveImplementation)
    {
        SaveImplementation = saveImplementation;
    }

    public void Run()
    {
        var isRunning = true;

        while (isRunning)
        {
            Console.WriteLine("1. Add beer");
            Console.WriteLine("2. Save beers");
            Console.WriteLine("3. Exit");
            Console.Write("Choose an option: ");

            isRunning = HandleOption(Console.ReadLine());
        }
    }

    private bool HandleOption(string? option)
    {
        switch (option)
        {
            case "1":
                AddBeer();
                return true;
            case "2":
                SaveBeers();
                return true;
            case "3":
                return false;
            default:
                Console.WriteLine("Invalid option.");
                return true;
        }
    }

    private void AddBeer()
    {
        Console.Write("Escribe el nombre de tu cerveza: ");
        var beer = Console.ReadLine();

        if (string.IsNullOrWhiteSpace(beer))
        {
            Console.WriteLine("Beer name cannot be empty.");
            return;
        }

        Beers.Add(beer);
    }

    private void SaveBeers()
    {
        SaveImplementation.Save(Beers);
    }
}