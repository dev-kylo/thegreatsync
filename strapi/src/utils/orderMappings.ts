import { PaddleFulfillment} from "../../custom-types";

export function mapPaddleOrder(order: PaddleFulfillment, ){
    const extracted = order.p_custom_data;
    const dateObject = new Date(order.release_date);

    // Now, to format the Date object into the desired form (ISO 8601):
    const formattedDate = dateObject.toISOString().slice(0, 10);
    return {
        email: order.email,
        country: order.p_country,
        coupon: order.p_coupon,
        currency: order.p_currency,
        customer_name: order.customer_name,
        fee: order.p_paddle_fee,
        event_time: order.event_time,
        marketing_consent: order?.marketing_consent || '0',
        order_id: order.p_order_id,
        tax: order.p_tax_amount,
        sale_gross: order.p_sale_gross,
        release_price: order.release_price,
        release_date: formattedDate,
        release_course_id: `${order.release_course_id}`,
        customData: extracted
    }
}

