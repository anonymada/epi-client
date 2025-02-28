## SERVE
```bash
    npx ng serve --no-open --host=0.0.0.0 --port=8101 --configuration=production
```
## TODO

    - ng serve ne marche pas
    - component/product-insert/product-insert.component.ts:
        > Explication d'obtenir la valeur (Random?) du idProduct dans save()
    - component/photo/photo.component.ts:
        > ajout i18-n dans les textes du addPhoto()
    - Tester calculator avec les nombres impossibles et infinie: 1 / 0
    - Tester calculator avec plusieur operateur
    - Ajout de boutton de copier au resultat du calculator
    - ...
    - En periode de synchronisation:
        > changer la couleur du AppBar (barre de notification de appareil):
            * Jaune (or default AppBar color): pas de synchronisation
            * Orange: en cours
            * Vert: si reussir, basculer en Jaune apres 2s
            * Rouge: si echec, basculer en Jaune apres 2s