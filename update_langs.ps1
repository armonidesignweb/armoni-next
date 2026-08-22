$files = @{
    "tr" = @{
        "bestseller" = "En Çok Satan"
        "customOrderText" = "Özel ölçü ve kumaş seçenekleri için bizimle iletişime geçebilirsiniz."
        "whatsappInfo" = "WhatsApp'tan Bilgi Al"
    }
    "en" = @{
        "bestseller" = "Bestseller"
        "customOrderText" = "You can contact us for custom dimensions and fabric options."
        "whatsappInfo" = "Get Info via WhatsApp"
    }
    "de" = @{
        "bestseller" = "Bestseller"
        "customOrderText" = "Für Sondermaße und Stoffoptionen können Sie uns kontaktieren."
        "whatsappInfo" = "Info über WhatsApp erhalten"
    }
    "ru" = @{
        "bestseller" = "Хит продаж"
        "customOrderText" = "Вы можете связаться с нами для нестандартных размеров и вариантов ткани."
        "whatsappInfo" = "Получить информацию через WhatsApp"
    }
    "ar" = @{
        "bestseller" = "الأكثر مبيعاً"
        "customOrderText" = "يمكنك التواصل معنا لمعرفة خيارات المقاسات والأقمشة الخاصة."
        "whatsappInfo" = "احصل على معلومات عبر الواتساب"
    }
}

foreach ($lang in $files.Keys) {
    $path = "c:\Users\TOLGA HOCA\Desktop\armonidesign.com\armoni-next\messages\$lang.json"
    $json = Get-Content $path -Raw -Encoding UTF8 | ConvertFrom-Json
    
    $json.products | Add-Member -Force -Type NoteProperty -Name 'bestseller' -Value $files[$lang]["bestseller"]
    $json.products | Add-Member -Force -Type NoteProperty -Name 'customOrderText' -Value $files[$lang]["customOrderText"]
    $json.products | Add-Member -Force -Type NoteProperty -Name 'whatsappInfo' -Value $files[$lang]["whatsappInfo"]
    $json.featured | Add-Member -Force -Type NoteProperty -Name 'bestseller' -Value $files[$lang]["bestseller"]
    
    $json | ConvertTo-Json -Depth 10 | Set-Content $path -Encoding UTF8
}
