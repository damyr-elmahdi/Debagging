<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'total_price',
        'status',
        'address',
        'payment_method',
        'delivery_status'
    ];

    // Relationship with order items
    public function orderItems()
    {
        return $this->hasMany(OrderItem::class);
    }

    // Relationship with user
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Get order details
    public function getOrderDetails()
    {
        return [
            'id' => $this->id,
            'address' => $this->address,
            'payment_method' => $this->payment_method,
            'delivery_status' => $this->delivery_status,
            'items' => $this->orderItems->map(function($item) {
                return [
                    'product' => $item->product->nom,
                    'quantity' => $item->quantity,
                    'price' => $item->price
                ];
            }),
            'total' => $this->total_price
        ];
    }
}