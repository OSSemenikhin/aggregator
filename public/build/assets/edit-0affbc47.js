document.addEventListener("DOMContentLoaded",()=>{const n={deleteButton:document.getElementById("shop_photos_remove"),formDelete:document.getElementById("shop_photos_form"),list:document.getElementById("shop_photos_list"),count:document.getElementById("shop_photos_count"),init(){this.deleteButton.addEventListener("click",this.confirm)},confirm(){$modal.options.setConfirm(()=>n.delete())},async delete(){const t=new FormData(this.formDelete),e=await fetch("/admin/shops/update_photos",{method:"POST",headers:{"X-CSRF-TOKEN":document.querySelector('meta[name="csrf-token"]').getAttribute("content")},body:t}),o=await e.json();o.ok&&this.updateList(o.items,o.count)},updateList(t,e){this.list.innerHTML=t,this.count.innerHTML=e}};n.init()});
