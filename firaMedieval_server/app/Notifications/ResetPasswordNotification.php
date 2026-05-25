<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ResetPasswordNotification extends Notification
{
    use Queueable;

    public string $token;
    public string $email;

    public function __construct(string $token, string $email)
    {
        $this->token = $token;
        $this->email = $email;
    }

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $url = env('FRONTEND_URL') . '/reset-password/' . $this->token . '?email=' . urlencode($this->email);

        return (new MailMessage)
            ->subject('Restablir la teva contrasenya')
            ->greeting('Hola!')
            ->line('Has sol·licitat restablir la contrasenya del teu compte.')
            ->action('Restablir contrasenya', $url)
            ->line('Aquest enllaç caducarà en 60 minuts.')
            ->line('Si no has sol·licitat cap canvi de contrasenya, ignora aquest correu.')
            ->salutation('Salutacions, Fira Medieval d\'Hostalirc');
    }

    public function toArray(object $notifiable): array
    {
        return [];
    }
}
