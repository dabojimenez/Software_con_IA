interface INotification
{
    void SendNotification(string message);
}

class SMSNotification : INotification
{
    public void SendNotification(string message)
    {
        System.Console.WriteLine($"notificacion enviada por SMS: {message}");
    }
}

class EmailNotification : INotification
{
    public void SendNotification(string message)
    {
        System.Console.WriteLine($"notificacion enviada por Email: {message}");
    }
}