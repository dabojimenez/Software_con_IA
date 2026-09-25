var notification = new EmailNotification();
var sale = new Sale(notification);
sale.Create();

var notifications = new List<INotification>
{
    new SMSNotification(),
    new EmailNotification(),
    new PushNotification(),
}();

SendMessages(notifications, "Mensajes enviado a sistintos sitios");

void SendMessages(List<INotification> notifications, string message)
{
    foreach (var notification in notifications)
    {
        notification.SendNotification(message);
    }
}

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