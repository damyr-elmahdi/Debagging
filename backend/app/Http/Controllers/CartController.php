<?php

namespace App\Http\Controllers;

use App\Models\CartItem;
use App\Models\Product;
use Illuminate\Http\Request;

class CartController extends Controller
{
    public function index(Request $request)
    {
        $cartItems = CartItem::where('user_id', $request->user()->id)
            ->with('product')
            ->get();
            
        $total = 0;
        foreach ($cartItems as $item) {
            $total += $item->product->prix * $item->quantity;
        }
        
        return response()->json([
            'items' => $cartItems,
            'total' => $total
        ]);
    }
    
    public function add(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer|min:1',
        ]);
        
        $product = Product::findOrFail($request->product_id);
        
        // Check if product is in stock
        if ($product->stock < $request->quantity) {
            return response()->json([
                'message' => 'Not enough stock available'
            ], 400);
        }
        
        // Check if product already in cart
        $existingItem = CartItem::where('user_id', $request->user()->id)
            ->where('product_id', $request->product_id)
            ->first();
            
        if ($existingItem) {
            $newQuantity = $existingItem->quantity + $request->quantity;
            
            // Check if new quantity exceeds stock
            if ($product->stock < $newQuantity) {
                return response()->json([
                    'message' => 'Not enough stock available'
                ], 400);
            }
            
            $existingItem->quantity = $newQuantity;
            $existingItem->save();
        } else {
            CartItem::create([
                'user_id' => $request->user()->id,
                'product_id' => $request->product_id,
                'quantity' => $request->quantity
            ]);
        }
        
        return response()->json([
            'message' => 'Product added to cart'
        ]);
    }
    
    public function update(Request $request, $id)
    {
        $request->validate([
            'quantity' => 'required|integer|min:1',
        ]);
        
        $cartItem = CartItem::where('id', $id)
            ->where('user_id', $request->user()->id)
            ->firstOrFail();
            
        $product = Product::findOrFail($cartItem->product_id);
        
        // Check if product is in stock
        if ($product->stock < $request->quantity) {
            return response()->json([
                'message' => 'Not enough stock available'
            ], 400);
        }
        
        $cartItem->quantity = $request->quantity;
        $cartItem->save();
        
        return response()->json([
            'message' => 'Cart updated'
        ]);
    }
    
    public function remove(Request $request, $id)
    {
        $cartItem = CartItem::where('id', $id)
            ->where('user_id', $request->user()->id)
            ->firstOrFail();
            
        $cartItem->delete();
        
        return response()->json([
            'message' => 'Item removed from cart'
        ]);
    }
    
    public function clear(Request $request)
    {
        CartItem::where('user_id', $request->user()->id)->delete();
        
        return response()->json([
            'message' => 'Cart cleared'
        ]);
    }
}