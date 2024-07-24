import React from 'react'
import CtaBtn from '../../component/btn/CtaBtn';
import Field from '../../component/field-filter/Field';

const Billing = ({ userId, URL }) => {
  return (
    <div className='px-[35px] py-[24px] bg-neutral-0 sm:rounded-lg sm:max-w-[436px]'>
      <form>
        <h3 className='h3-sans mb-[15px]'>Billing</h3>
        <Field
          label="Billing period"
          name="belling_period"
          type="text"
          value="Monthly"
          disabled
        />
        <Field
          label="Payment method"
          name="payment_method"
          type="text"
          value="**** **** **** 1234"
          disabled
        />
        <CtaBtn 
          size="L" 
          level="D"
          type="submit"
          innerTxt="Save" 
          disabled
        />
        <p className='text-center mt-[20px] text-neutral-600'>Cancel Subscription</p>
      </form>
    </div>
  )
}

export default Billing