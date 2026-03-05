<?php

namespace App\Integrations\VakifKatilim;

use App\Models\Payment;
use App\Settings\PaymentSettings;
use Mews\LaravelPos\Factory\GatewayFactory;
use Mews\Pos\Factory\CreditCardFactory;
use Mews\Pos\Gateways\VakifKatilimPos;
use Mews\Pos\PosInterface;
use Psr\EventDispatcher\EventDispatcherInterface;
use Psr\Http\Client\ClientInterface;
use Psr\Log\LoggerInterface;
use RuntimeException;

class VakifKatilimPaymentProvider
{
    public const BANK_KEY = 'vakif_katilim';

    public function __construct(
        private readonly PaymentSettings $settings,
        private readonly EventDispatcherInterface $eventDispatcher,
        private readonly LoggerInterface $logger,
        private readonly ClientInterface $httpClient,
    ) {}

    public function isConfigured(): bool
    {
        return $this->missingConfigFields() === [];
    }

    /**
     * @return list<string>
     */
    public function missingConfigFields(): array
    {
        $required = [
            'vakif_katilim_merchant_id' => $this->settings->vakif_katilim_merchant_id,
            'vakif_katilim_terminal_id' => $this->settings->vakif_katilim_terminal_id,
            'vakif_katilim_user_name' => $this->settings->vakif_katilim_user_name,
            'vakif_katilim_enc_key' => $this->settings->vakif_katilim_enc_key,
            'vakif_katilim_payment_api' => $this->settings->vakif_katilim_payment_api,
            'vakif_katilim_gateway_3d' => $this->settings->vakif_katilim_gateway_3d,
        ];

        return collect($required)
            ->filter(fn (string $value) => trim($value) === '')
            ->keys()
            ->values()
            ->all();
    }

    /**
     * @param  array<string, mixed>  $cardPayload
     * @return array<string, mixed>|string
     */
    public function create3DFormData(Payment $payment, array $cardPayload): array|string
    {
        $gatewayOrder = data_get($payment->raw_request, 'gateway_order');
        if (! is_array($gatewayOrder)) {
            throw new RuntimeException('Vakıf Katılım ödeme kaydında gateway order bilgisi bulunamadi.');
        }

        $pos = $this->gateway();
        $card = $this->createCard($pos, $cardPayload);

        return $pos->get3DFormData(
            $gatewayOrder,
            PosInterface::MODEL_3D_SECURE,
            PosInterface::TX_TYPE_PAY_AUTH,
            $card,
            false
        );
    }

    /**
     * @return array{success: bool, response: array<string, mixed>}
     */
    public function complete3DPayment(Payment $payment): array
    {
        $gatewayOrder = data_get($payment->raw_request, 'gateway_order');
        if (! is_array($gatewayOrder)) {
            throw new RuntimeException('Vakıf Katılım ödeme kaydında gateway order bilgisi bulunamadi.');
        }

        $pos = $this->gateway();
        $pos->payment(
            PosInterface::MODEL_3D_SECURE,
            $gatewayOrder,
            PosInterface::TX_TYPE_PAY_AUTH
        );

        return [
            'success' => $pos->isSuccess(),
            'response' => $pos->getResponse(),
        ];
    }

    /**
     * @param  array<string, mixed>  $cardPayload
     */
    private function createCard(PosInterface $pos, array $cardPayload): \Mews\Pos\Entity\Card\CreditCardInterface
    {
        $cardNumber = preg_replace('/\D+/', '', (string) ($cardPayload['card_number'] ?? '')) ?? '';
        $cardMonthInt = (int) ($cardPayload['card_exp_month'] ?? 0);
        $cardMonth = str_pad((string) $cardMonthInt, 2, '0', STR_PAD_LEFT);
        $cardYear = preg_replace('/\D+/', '', (string) ($cardPayload['card_exp_year'] ?? '')) ?? '';
        $cardCvv = preg_replace('/\D+/', '', (string) ($cardPayload['card_cvv'] ?? '')) ?? '';
        $cardHolder = trim((string) ($cardPayload['card_holder'] ?? ''));

        if ($cardMonthInt < 1 || $cardMonthInt > 12) {
            throw new RuntimeException('Kart son kullanma ayi gecersiz.');
        }

        if (strlen($cardYear) === 2) {
            $cardYear = '20'.$cardYear;
        }

        if (strlen($cardYear) !== 4) {
            throw new RuntimeException('Kart son kullanma yili gecersiz.');
        }

        try {
            return CreditCardFactory::createForGateway(
                $pos,
                $cardNumber,
                $cardYear,
                $cardMonth,
                $cardCvv,
                $cardHolder
            );
        } catch (\Throwable $e) {
            throw new RuntimeException('Kart bilgileri gecersiz veya desteklenmiyor.', previous: $e);
        }
    }

    private function gateway(): PosInterface
    {
        $gateway = GatewayFactory::create(
            self::BANK_KEY,
            [
                'gateway_class' => VakifKatilimPos::class,
                'lang' => PosInterface::LANG_TR,
                'credentials' => [
                    'payment_model' => PosInterface::MODEL_3D_SECURE,
                    'merchant_id' => $this->settings->vakif_katilim_merchant_id,
                    'terminal_id' => $this->settings->vakif_katilim_terminal_id,
                    'user_name' => $this->settings->vakif_katilim_user_name,
                    'enc_key' => $this->settings->vakif_katilim_enc_key,
                ],
                'gateway_configs' => [
                    'test_mode' => $this->settings->vakif_katilim_test_mode,
                    'disable_3d_hash_check' => $this->settings->vakif_katilim_disable_3d_hash_check,
                ],
                'gateway_endpoints' => [
                    'payment_api' => $this->settings->vakif_katilim_payment_api,
                    'gateway_3d' => $this->settings->vakif_katilim_gateway_3d,
                    'gateway_3d_host' => $this->settings->vakif_katilim_gateway_3d_host,
                ],
            ],
            $this->eventDispatcher,
            $this->logger,
            $this->httpClient,
        );

        if (! $gateway instanceof PosInterface) {
            throw new RuntimeException('Vakıf Katılım gateway olusturulamadi.');
        }

        return $gateway;
    }
}
