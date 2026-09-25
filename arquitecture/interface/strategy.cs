var notification = new EmailNotification();
var sale = new Sale(notification);
sale.Create();


interface INotification
{
    void SendNotification(string message);
}

class SMSNotification : INotification
{
    public void SendNotification(string message)
    {
        Console.WriteLine($"notificacion enviada por SMS: {message}");
    }
}

class EmailNotification : INotification
{
    public void SendNotification(string message)
    {
        Console.WriteLine($"notificacion enviada por Email: {message}");
    }
}

class PushNotification : INotification
{
    public void SendNotification(string message)
    {
        Console.WriteLine($"notificacion enviada por PUSH: {message}");
    }
}

class Sale
{
    private INotification _notification;
    public Sale(INotification notification)
    {
        _notification = notification;
    }

    public void Create()
    {
        Console.WriteLine("Venta creada exitosamente");

        // notificamos
        _notification.SendNotification("Se ha creado una venta");
    }
}