class SMSNotification
{
    public void SendSMS(string message)
    {
        System.Console.WriteLine("Sendig SMS: " + message);
    }
}

class Sale
{
    SMSNotification sMSNotification = new SMSNotification();

    public void Create()
    {
        System.Console.WriteLine("Venta creada");
        sMSNotification("Tu venta fue creada exitosamente");
    }
}